import { Component, NgZone, Output, EventEmitter } from "@angular/core";
import { Timer } from "../../shared/time/timer";
import { InputTimer } from "../../shared/time/input-timer";

@Component({
    selector: "time-tracker",
    templateUrl: "components/time-tracker/time-tracker.html"//,
})
export class TimeTrackerComponent {

    @Output() private timerStarted: EventEmitter<any> = new EventEmitter<any>(false);
    @Output() private timerStopped: EventEmitter<number> = new EventEmitter<number>(false);

    private duration: Timer;
    private isTracking: boolean = false;
    private ellapsedTime: string;

    constructor(private _zone: NgZone) {
        this.duration = new Timer();
    }

    /**
     * stops the timer that is tracking amount of time spent on the work item
     *
     * @private
     */
    public stopTimer(): void {
        if (this.isTracking === true) {
            this.duration.stop();
            this.timerStopped.emit(this.duration.getEllapsedMilliseconds());
            this.isTracking = false;
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
    }

    /**
     * starts the timer to track amount of time spent on the work item
     *
     * @private
     */
    private startTimer(): void {
        if (this.isTracking === false) {
            this.ellapsedTime = null;
            this.duration.start(() => this.updateEllapsedTime(), 30000);
            this.isTracking = true;
            this.updateEllapsedTime();
            this.timerStarted.emit(null);
        }
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
}