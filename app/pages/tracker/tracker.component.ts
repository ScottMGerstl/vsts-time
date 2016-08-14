import { Component, NgZone } from "@angular/core";
import { Timer } from "../../shared/timer/timer";
import { InputTimer } from "../../shared/timer/input-timer";

@Component({
    selector: "tracker",
    templateUrl: "pages/tracker/tracker.html",
    styleUrls: ["pages/tracker/tracker-common.css", "pages/tracker/tracker.css"]
})
export class TrackerPage {

    // Work Item Number vars
    private workItemNumber: string;
    private workItemInputWaitTimer: InputTimer;

    // Timer vars
    private duration: Timer;
    private isTracking: boolean = false;
    private elapsedTime: string;

    constructor(private _zone: NgZone) {
        this.duration = new Timer();
        this.workItemInputWaitTimer = new InputTimer(() => this.retrieveWorkItem(), 700);
    }

    /**
     * the primary handler for when a new value is typed into the work item number field
     *
     * @private
     */
    private onWorkItemNumberChanged(event: any): void {

        // Get the text field value
        let workItemNumberTextFieldValue: string = event.value;

        // protect against multiple fires of the event
        if(workItemNumberTextFieldValue != this.workItemNumber) {

            // assign to component field
            this.workItemNumber = workItemNumberTextFieldValue;

            // Allow the user some time and then execute the callback defined in the constructor
            this.workItemInputWaitTimer.startOrRestart();
        }
    }

    /**
     * Retrieve the work item
     *
     * @private
     */
    private retrieveWorkItem(): void {
        if (this.workItemNumber !== "" && this.workItemNumber !== undefined && this.workItemNumber !== null) {
            console.log(`getting work item ${this.workItemNumber}`);
        }
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
        this.elapsedTime = null;
        this.duration.start(() => this.updateEllapsedTime(), 60000);
        this.updateEllapsedTime();
    }

    /**
     * stops the timer that is tracking amount of time spent on the work item
     *
     * @private
     */
    private stopTimer(): void {
        this.duration.stop();
        this.updateEllapsedTime();
    }

    /**
     * update the UI to show how much time has passed
     *
     * @private
     */
    private updateEllapsedTime() {
        this._zone.run(() => {
            this.elapsedTime = this.duration.getEllapsedReadableTime();
        })
    }
}