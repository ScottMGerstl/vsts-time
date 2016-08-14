import { Component, NgZone } from "@angular/core";
import { Timer } from "../../shared/timer/timer";
import * as timer from "timer";
import * as moment from "moment";

@Component({
    selector: "tracker",
    providers: [],
    templateUrl: "pages/tracker/tracker.html",
    styleUrls: ["pages/tracker/tracker-common.css", "pages/tracker/tracker.css"]
})
export class TrackerPage {

    // Work Item Number vars
    private workItemNumber: string;
    private workitemWaitTimerRef: number;

    // Timer vars
    private duration: Timer;
    private isTracking: boolean = false;
    private elapsedTime: string;

    constructor(private _zone: NgZone) {
        this.duration = new Timer();
    }

    /**
     * the primary handler for when a new value is typed into the work item number field
     *
     * @private
     */
    private onWorkItemNumberChanged(event: any): void {

        let workItemNumberTextFieldValue: string = event.value;

        if(workItemNumberTextFieldValue != this.workItemNumber) {
            this.workItemNumber = workItemNumberTextFieldValue;
            this.startWorkItemTimer();
        }
    }

    /**
     * Start a timer to retrieve the work item allowing the user to finish typing before the work item is retrieved
     *
     * @private
     */
    private startWorkItemTimer(): void {
        // If a timer is running clear it out so it starts over
        if(this.workitemWaitTimerRef) {
            timer.clearTimeout(this.workitemWaitTimerRef);
        }

        // give the user some time to finish typing
        this.workitemWaitTimerRef = timer.setTimeout(() => {
            // If the work item is blank after the timer ends, don't make the call
            if (this.workItemNumber !== "" && this.workItemNumber !== undefined && this.workItemNumber !== null) {
                this.retrieveWorkItem();
            }
        }, 700);
    }

    /**
     * Retrieve the work item
     *
     * @private
     */
    private retrieveWorkItem(): void {
        console.log(`getting work item ${this.workItemNumber}`);
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