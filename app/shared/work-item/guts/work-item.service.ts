import { Injectable, provide } from "@angular/core";
import { BaseService } from "../../base.service";
import { AuthService } from "../../auth/guts/auth.service";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { WorkItem, WorkItemTypes, WorkItemStatuses } from "./work-item.model";
import { WorkItemUpdate, WorkItemUpdateList } from "./work-item-update.model";
import { convertMsToRoundedHours } from "../../time/time-conversions";

import { VstsService } from "./vsts.service";

@Injectable()
export class WorkItemService extends BaseService {

    constructor(private _auth: AuthService, private _vstsService: VstsService) {
        super();
    }

    /**
     * Gets a work item by id
     *
     * @param {number} id The id of the work item to get
     * @returns {Observable<WorkItem>} the retrieved work item
     */
    public getWorkItem(id: number): Observable<WorkItem> {
        return this._vstsService.getWorkItem(id);
    }

    /**
     * Gets the work items for the signed in user
     *
     * @returns {Observable<WorkItem[]>} the signed in user's work items
     */
    public getUserWorkItems(): Observable<WorkItem[]> {
        let query: string = `Select [System.Id] From WorkItems Where [System.AssignedTo] = '${this._auth.user.email}' And [System.State]='Active' And [System.WorkItemType]='Task'`;

        return this._vstsService.runFlatWorkItemQuery(query).flatMap(
            (ids) => this._vstsService.getWorkItems(ids)
        );
    }

    /**
     * Updates the remaining and completed times, and possibly the status, on a work item.
     * If a work item's remaining time results in a number less than zero, it will be set
     * to zero. If a work item was in a new state, it will set it to active.
     *
     * @param {WorkItem} workItem the work item to update the time in
     * @param {number} msToUpdate the amount of time
     * @returns {Observable<WorkItem>} an observable containing the updated work item
     */
    public updateWorkItem(workItem: WorkItem, msToUpdate: number): Observable<WorkItem> {

        // check for supported types
        if (workItem.type !== WorkItemTypes.Bug && workItem.type !== WorkItemTypes.Task) {
            return Observable.throw(`Time cannot be updated for ${workItem.type}s`);
        }

        // Because immutable
        let workItemToUpdate: WorkItem = Object.assign({}, workItem);

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

        if (workItemToUpdate.status === WorkItemStatuses.New && workItemToUpdate.completedTime > 0) {
            workItemToUpdate.status = WorkItemStatuses.Active;
            updates.addStatus(workItemToUpdate.status);
        }

        return this._vstsService.updateWorkItem(workItemToUpdate.id, updates);
    }

    /**
     * Closes the work item
     *
     * @param {number} id the work item id
     * @returns {Observable<WorkItem>} the updated work item
     */
    public closeWorkItem(workItemId: number): Observable<WorkItem> {
        let updates: WorkItemUpdateList = new WorkItemUpdateList();

        updates.addStatus(WorkItemStatuses.Closed);

        return this._vstsService.updateWorkItem(workItemId, updates);
    }
}