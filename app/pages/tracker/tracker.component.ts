import { Component, NgZone, ElementRef, ViewChild } from "@angular/core";
import { Timer } from "../../shared/timer/timer";
import { InputTimer } from "../../shared/timer/input-timer";

import { TextField } from "ui/text-field";

import { WorkItemService } from "../../shared/work-item/work-item.service";
import { WorkItem } from "../../shared/work-item/work-item.model";

@Component({
    selector: "tracker",
    providers: [WorkItemService],
    templateUrl: "pages/tracker/tracker.html",
    styleUrls: ["pages/tracker/tracker-common.css", "pages/tracker/tracker.css"]
})
export class TrackerPage {

    @ViewChild("workItemNumberField") private workItemNumberField: ElementRef;

    // Work Item vars
    private workItemNumber: string;
    private workItemInputWaitTimer: InputTimer;
    private workItem: WorkItem;

    // Timer vars
    private duration: Timer;
    private isTracking: boolean = false;
    private ellapsedTime: string;

    // history
    private timeLog: List<any>;

    constructor(private _zone: NgZone, private _workItemService: WorkItemService) {
        this.duration = new Timer();
        this.workItemInputWaitTimer = new InputTimer(() => this.retrieveWorkItem(), 700);

        this.timeLog = [];
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
            if(workItemNumberTextFieldValue != this.workItemNumber) {

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
            this._workItemService.getWorkItem(parseInt(this.workItemNumber)).subscribe(
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
     * Main method for managing the state of the time tracker
     *
     * @private
     */
    private toggleTracking() {
        if (this.isTracking === true) {
            this.stopTimer();
        }
        else {
            this.startTimer();
        }

        this.isTracking = !this.isTracking;
    }

    /**
     * starts the timer to track amount of time spent on the work item
     *
     * @private
     */
    private startTimer(): void {
        this.dismissKeyboard(this.workItemNumberField);
        this.ellapsedTime = null;
        this.duration.start(() => this.updateEllapsedTime(), 30000);
        this.updateEllapsedTime();
    }

    /**
     * stops the timer that is tracking amount of time spent on the work item
     *
     * @private
     */
    private stopTimer(): void {
        this.duration.stop();
        this.addTimeToHistory();
        this.updateEllapsedTime();
        this._workItemService.updateTimes(this.workItem, this.duration.getEllapsedMilliseconds()).subscribe(
            () => {},
            (errorMessage) => alert(errorMessage)
        );
    }

    /**
     * update the UI to show how much time has passed
     *
     * @private
     */
    private updateEllapsedTime() {
        this._zone.run(() => {
            this.ellapsedTime = this.duration.getEllapsedReadableTime();
        })
    }

    /**
     * TEMPORARY? adds the work item and time to a history log
     *
     * @private
     */
    private addTimeToHistory(): void {
        this.timeLog.push({
            workItemNumber: this.workItem.id,
            timeSpent: this.duration.getEllapsedMilliseconds(),
            readableTimeSpent: this.duration.getEllapsedReadableTime()
        });
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
        this.ellapsedTime = null;
    }
}