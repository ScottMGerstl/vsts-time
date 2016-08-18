import { Component, NgZone, ElementRef, ViewChild } from "@angular/core";

import { convertMsToRoundedHours } from "../../shared/time/time-conversions";
import { InputTimer } from "../../shared/time/input-timer";
import { TimeTrackerComponent } from "../../components/time-tracker/time-tracker.component";

import { TextField } from "ui/text-field";

import { WorkItem, WorkItemLogic, WORK_ITEM_PROVIDERS } from "../../shared/work-item/work-item.barrel";

@Component({
    selector: "tracker",
    providers: [WorkItemLogic, WORK_ITEM_PROVIDERS],
    directives: [TimeTrackerComponent],
    templateUrl: "pages/tracker/tracker.html",
    styleUrls: ["pages/tracker/tracker-common.css", "pages/tracker/tracker.css"]
})
export class TrackerPage {

    @ViewChild("workItemNumberField") private workItemNumberField: ElementRef;
    @ViewChild(TimeTrackerComponent) private timeTracker: TimeTrackerComponent;

    // Work Item vars
    private workItemNumber: string;
    private workItemInputWaitTimer: InputTimer;
    private workItem: WorkItem;

    // history
    private timeLog: List<any>;

    // user work items
    private userWorkItems: WorkItem[];

    constructor(private _zone: NgZone, private _workItemLogic: WorkItemLogic) {
        this.workItemInputWaitTimer = new InputTimer(() => this.retrieveWorkItem(), 700);
        this.timeLog = [];
    }

    private onTimerStarted(): void {
        this.dismissKeyboard(this.workItemNumberField);
    }

    private onTimerStopped(timeEllapsed): void {
        if (this.workItem) {
            this.addTimeToHistory(timeEllapsed);
            this._workItemLogic.updateWorkItem(this.workItem, timeEllapsed)
            .subscribe(
                (savedWorkItem) => this.workItem = savedWorkItem,
                (errorMessage) => alert(errorMessage)
            );
        }
    }

    /**
     * the primary handler for when a new value is typed into the work item number field
     *
     * @private
     */
    private onWorkItemNumberChanged(event: any): void {

        // Make sure it was text that changed
        if (event.propertyName === "text") {

            // Get the text field value
            let workItemNumberTextFieldValue: string = event.value;

            // protect against multiple fires of the event
            if (workItemNumberTextFieldValue != this.workItemNumber) {

                // assign the field value and dispose of previous data
                this.disposeWorkItemInfo();
                this.workItemNumber = workItemNumberTextFieldValue;

                // Allow the user some time and then execute the callback defined in the constructor
                this.workItemInputWaitTimer.startOrRestart();
            }
        }
    }

    /**
     * Retrieve the work item
     *
     * @private
     */
    private retrieveWorkItem(): void {
        if (this.workItemNumber !== "" && this.workItemNumber !== undefined && this.workItemNumber !== null) {
            this._workItemLogic.getWorkItem(parseInt(this.workItemNumber)).subscribe(
                (workItems) => this.onWorkItemRecieved(workItems),
                () => alert(`There was a problem trying to get the work item #${this.workItemNumber}`)
            );
        }
    }

    /**
     * handles the work item after it has been receieved from the server
     *
     * @private
     * @param {WorkItem} workItem
     */
    private onWorkItemRecieved(workItem: WorkItem): void {
        this.workItem = workItem;
    }

    /**
     * TEMPORARY? adds the work item and time to a history log
     *
     * @private
     */
    private addTimeToHistory(timeEllapsed: number): void {
        this.timeLog.push({
            workItemNumber: this.workItem.id,
            timeSpent: timeEllapsed,
            readableTimeSpent: convertMsToRoundedHours(timeEllapsed)
        });
    }

    /**
     * Gets the user's work items
     *
     * @private
     */
    private getUserWorkItems(): void {
        this._workItemLogic.getUserWorkItems().subscribe(
            (workItems) => this._zone.run(() => this.userWorkItems = workItems),
            (error) => alert(error)
        );
    }

    private onWorkItemTapped(workItem: WorkItem): void {
        this.timeTracker.stopTimer();
        this.disposeWorkItemInfo();

        this._zone.run(() => this.workItem = workItem);
    }

    /**
     * dismisses the keyboard
     *
     * @private
     * @param {ElementRef} textField the textfield that should have the keyboard dismissed
     */
    private dismissKeyboard(textField: ElementRef): void {
        let field = <TextField>textField.nativeElement;
        field.dismissSoftInput();
    }

    /**
     * Destroys all work item information. Should be used when the
     * user changes the work item number to track
     *
     * @private
     */
    private disposeWorkItemInfo(): void {
        this.workItemNumber = null;
        this.workItem = null;
    }
}