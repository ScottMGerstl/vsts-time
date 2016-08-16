import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Http, Headers, Response } from "@angular/http";
import { WorkItem } from "./work-item.model";
import { WorkItemUpdate } from "./work-item-update.model";
import { VstsFieldDefinitions } from "./vsts-field-definitions";

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

        return this._http.get(url, { headers: this.getHeadersWithAuth() })
        .map(res => res.json())
        .map(data => this.mapToWorkItem(data.value[0]))
        .catch(this.handleErrors);
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

        if (workItem.type !== "Bug" && workItem.type !== "Task") {
            return Observable.throw(`Time cannot be updated for ${workItem.type}s`);
        }

        let trackedTime = this.convertMsToRoundedHours(msToUpdate);
        workItem.completedTime = (workItem.completedTime || 0) + trackedTime;
        workItem.remainingTime = (workItem.remainingTime || 0) - trackedTime;

        if(workItem.remainingTime < 0) {
            workItem.remainingTime = 0;
        }

        let updateDefinition: any = [{
                "op": "replace",
                "path": "/fields/Microsoft.VSTS.Scheduling.CompletedWork",
                "value": workItem.completedTime
            },{
                "op": "replace",
                "path": "/fields/Microsoft.VSTS.Scheduling.RemainingWork",
                "value": workItem.remainingTime
            }
        ];

        return this.updateWorkItem(workItem.id, updateDefinition);
    }

    /**
     * updates a work item given the unformation to update
     *
     * @private
     * @param {number} workItemId
     * @param {WorkItemUpdate[]} updateDefinition
     * @returns
     */
    private updateWorkItem(workItemId: number, updateDefinition: WorkItemUpdate[]) {
        let headers: Headers = this.getHeadersWithAuth();
        headers.append("Content-Type", "application/json-patch+json");

        let url: string = this.createUrl(`wit/workitems/${workItemId}?api-version=1.0`);

        return this._http.patch(url, updateDefinition, { headers: headers })
        .map(res => res.json())
        .map(data => this.mapToWorkItem(data))
        .catch(this.handleErrors);
    }

    /**
     * Converts milliseconds into hours rounded to 2 decimal places
     *
     * @private
     * @param {number} ms the milliseconds to convert
     * @returns {number} the rounded hours (e.g. 1.02)
     */
    private convertMsToRoundedHours(ms: number): number {
        let hours: number = parseFloat((ms / 1000 / 60 / 60).toFixed(2));
        return hours;
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