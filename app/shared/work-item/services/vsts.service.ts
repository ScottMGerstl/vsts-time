import { Injectable } from "@angular/core";
import { BaseService } from "../../base.service";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Http, Headers, Response } from "@angular/http";
import { WorkItem, WorkItemFieldDefinitions } from "../models/work-item.model";
import { WorkItemUpdateList } from "../models/work-item-update.model";

@Injectable()
export class VstsService extends BaseService {

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
            .map(data => data[0])
            .catch(this.handleObservableErrors);
    }

    /**
     * updates a work item given the unformation to update
     *
     * @private
     * @param {number} workItemId
     * @param {WorkItemUpdateList} updateDefinition
     * @returns
     */
    public updateWorkItem(workItemId: number, updateDefinition: WorkItemUpdateList): Observable<WorkItem> {
        let headers: Headers = this.getHeadersWithAuth();
        headers.append("Content-Type", "application/json-patch+json");

        let url: string = this.createUrl(`wit/workitems/${workItemId}?api-version=1.0`);

        return this._http.patch(url, updateDefinition.resolveToArray(), { headers: headers })
            .map(res => res.json())
            .map(data => this.mapToWorkItem(data))
            .catch(this.handleObservableErrors);
    }

    /**
     * Get the work items that correspond to the passed in ids
     *
     * @private
     * @param {number[]} ids the work items to get
     * @returns {Observable<any>} the raw data returned from vsts
     */
    public getWorkItems(ids: number[]): Observable<WorkItem[]> {

        let url: string = this.createUrl(`wit/workitems?ids=${ids.join(",")}&api-version=1.0`);

        return this._http.get(url, { headers: this.getHeadersWithAuth() })
            .map(res => res.json())
            .map(
                (workItemDataList) => {
                    let workItems: WorkItem[] = [];
                    workItemDataList.value.forEach(workItemData => {
                        workItems.push(this.mapToWorkItem(workItemData));
                    });
                    return workItems;
            })
            .catch(this.handleObservableErrors)
    }

    /**
     * Run a flat query that retrieves work item ids
     *
     * @private
     * @param {string} queryString the query to run
     * @returns {Observable<number[]>} the ids returned from the query
     */
    public runFlatWorkItemQuery(queryString: string): Observable<number[]> {
        let url: string = this.createUrl(`wit/wiql?api-version=1.0`);
        let body: any = { query: queryString };

        let headers: Headers = this.getHeadersWithAuth();
        headers.append("Content-Type", "application/json");

        return this._http.post(url, body, { headers: headers })
            .map(res => res.json())
            .map(data => {
                let ids: number[] = [];
                data.workItems.forEach(element => { ids.push(element.id); });
                return ids;
            })
            .catch(this.handleObservableErrors);
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
            result.title = data.fields[WorkItemFieldDefinitions.Title];
            result.type = data.fields[WorkItemFieldDefinitions.Type];
            result.status = data.fields[WorkItemFieldDefinitions.Status];
            result.assignedTo = data.fields[WorkItemFieldDefinitions.AssignedTo];
            result.originalEstimate = data.fields[WorkItemFieldDefinitions.OriginalEstimate];
            result.completedTime = data.fields[WorkItemFieldDefinitions.CompletedTime];
            result.remainingTime = data.fields[WorkItemFieldDefinitions.RemainingTime];
        }

        return result;
    }
}