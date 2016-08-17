import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Http, Headers, Response } from "@angular/http";
import { WorkItem } from "./work-item.model";
import { WorkItemUpdate, WorkItemUpdateList } from "./work-item-update.model";
import { VstsFieldDefinitions } from "./vsts-field-definitions";

import { convertMsToRoundedHours } from "../time/time-conversions";

@Injectable()
export class WorkItemService extends BaseService {

    constructor(private _http: Http) {
        super();
    }

    /**
     * Gets a work item by id
     *
     * @param {number} id The id of the work item to get
     * @returns {Observable<WorkItem>} the retrieved work item
     */
    public getWorkItem(id: number): Observable<WorkItem> {

        let url: string = this.createUrl(`wit/workitems?ids=${id}&api-version=1.0`);

        return this.getWorkItems([id])
            .map(data => this.mapToWorkItem(data.value[0]))
            .catch(this.handleErrors);
    }

    /**
     * Gets the work items for the signed in user
     *
     * @returns {Observable<WorkItem[]>} the signed in user's work items
     */
    public getUserWorkItems(): Observable<WorkItem[]> {
        let query: string = `Select [System.Id] From WorkItems Where [System.AssignedTo] = '${this.getUserEmail()}' And [System.State]='Active' And [System.WorkItemType]='Task'`;

        // Get work item ids
        return this.runFlatWorkItemQuery(query).flatMap(

            // Use ids to get work items
            (ids) => this.getWorkItems(ids).map(
                (workItemDataList) => {
                    let workItems: WorkItem[] = [];
                    workItemDataList.value.forEach(workItemData => {
                        workItems.push(this.mapToWorkItem(workItemData));
                    });
                    return workItems;
                })
                .catch(this.handleErrors)
        );
    }

    // Stories: 11052,11053,11054,11055
    // Bugs: 11056,11057,11058,11059
    // Tasks: 11061,11062,11063

    /**
     * Updates the remaining and completed times on a work item. if a work item's remaining
     * results in a number less than zero, it will be set to zero
     *
     * @param {WorkItem} workItem the work item to update the time in
     * @param {number} msToUpdate the amount of time
     * @returns {Observable<WorkItem>} an observable containing the updated work item
     */
    public updateTimes(workItem: WorkItem, msToUpdate: number): Observable<WorkItem> {

        // check for supported types
        if (workItem.type !== "Bug" && workItem.type !== "Task") {
            return Observable.throw(`Time cannot be updated for ${workItem.type}s`);
        }

        // Because immutable
        let workItemToUpdate: WorkItem = Object.assign(workItem);

        // update times
        let trackedTime = convertMsToRoundedHours(msToUpdate);
        workItemToUpdate.completedTime = (workItemToUpdate.completedTime || 0) + trackedTime;
        workItemToUpdate.remainingTime = (workItemToUpdate.remainingTime || 0) - trackedTime;

        // resolve negative
        if (workItemToUpdate.remainingTime < 0) {
            workItemToUpdate.remainingTime = 0;
        }

        // add to update definition
        let updates: WorkItemUpdateList = new WorkItemUpdateList();
        updates.addCompletedTime(workItemToUpdate.completedTime);
        updates.addRemainingTime(workItemToUpdate.remainingTime);

        return this.updateWorkItem(workItemToUpdate.id, updates);
    }

    /**
     * Get the work items that correspond to the passed in ids
     *
     * @private
     * @param {number[]} ids the work items to get
     * @returns {Observable<any>} the raw data returned from vsts
     */
    private getWorkItems(ids: number[]): Observable<any> {

        let url: string = this.createUrl(`wit/workitems?ids=${ids.join(",")}&api-version=1.0`);

        return this._http.get(url, { headers: this.getHeadersWithAuth() })
            .map(res => res.json())
            .catch(this.handleErrors);
    }

    /**
     * Run a flat query that retrieves work item ids
     *
     * @private
     * @param {string} queryString the query to run
     * @returns {Observable<number[]>} the ids returned from the query
     */
    private runFlatWorkItemQuery(queryString: string): Observable<number[]> {
        let url: string = this.createUrl(`wit/wiql?api-version=1.0`);
        let body: any = { query: queryString };

        let headers = this.getHeadersWithAuth();
        headers.append("Content-Type", "application/json");

        return this._http.post(url, body, { headers: headers })
            .map(res => res.json())
            .map(data => {
                let ids: number[] = [];
                data.workItems.forEach(element => { ids.push(element.id); });
                return ids;
            })
            .catch(this.handleErrors);
    }

    /**
     * updates a work item given the unformation to update
     *
     * @private
     * @param {number} workItemId
     * @param {WorkItemUpdate[]} updateDefinition
     * @returns
     */
    private updateWorkItem(workItemId: number, updateDefinition: WorkItemUpdateList) {
        let headers: Headers = this.getHeadersWithAuth();
        headers.append("Content-Type", "application/json-patch+json");

        let url: string = this.createUrl(`wit/workitems/${workItemId}?api-version=1.0`);

        return this._http.patch(url, updateDefinition.resolveToArray(), { headers: headers })
            .map(res => res.json())
            .map(data => this.mapToWorkItem(data))
            .catch(this.handleErrors);
    }

    /**
     * Maps a vsts response object to a WorkItem
     *
     * @private
     * @param {*} data
     * @returns {WorkItem} returns the mapped data
     */
    private mapToWorkItem(data: any): WorkItem {
        let result = new WorkItem();

        if (data) {
            result.id = data.id;
            result.title = data.fields[VstsFieldDefinitions.titleField];
            result.type = data.fields[VstsFieldDefinitions.typeField];
            result.status = data.fields[VstsFieldDefinitions.statusField];
            result.assignedTo = data.fields[VstsFieldDefinitions.assignedToField];
            result.originalEstimate = data.fields[VstsFieldDefinitions.originalEstimateField];
            result.completedTime = data.fields[VstsFieldDefinitions.completedTimeField];
            result.remainingTime = data.fields[VstsFieldDefinitions.remainingTimeField];
        }

        return result;
    }
}