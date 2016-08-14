import { Component, NgZone } from "@angular/core";
import { Timer } from "../../shared/timer/timer";
import * as moment from "moment";
import * as timer from "timer";

@Component({
    selector: "tracker",
    providers: [],
    templateUrl: "pages/tracker/tracker.html",
    styleUrls: ["pages/tracker/tracker-common.css", "pages/tracker/tracker.css"]
})
export class TrackerPage {
    private duration: Timer;
    private isTracking: boolean = false;
    private elapsedTime: string;

    constructor(private _zone: NgZone) {
        this.duration = new Timer();
    }

    private toggleTracking() {
        if (this.isTracking === true) {
            this.recordStop();
        }
        else {
            this.recordStart();
        }

        this.isTracking = !this.isTracking;
    }

    private recordStart(): void {
        this.elapsedTime = null;
        this.duration.start(() => this.updateEllapsedTime(), 60000);
        this.updateEllapsedTime();
    }

    private recordStop(): void {
        this.duration.stop();
        this.updateEllapsedTime();
    }

    private updateEllapsedTime() {
        this._zone.run(() => {
            this.elapsedTime = this.duration.getEllapsedReadableTime();
        })
    }
}