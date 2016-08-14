import { Component, NgZone, ElementRef, ViewChild } from "@angular/core";
import { TextField } from "ui/text-field";
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

    @ViewChild("workItemNumberField") private workItemNumberField: ElementRef;
    private workItemNumber: string;

    private duration: Timer;
    private isTracking: boolean = false;
    private elapsedTime: string;

    constructor(private _zone: NgZone) {
        this.duration = new Timer();
    }

    private onWorkItemNumberChanged() {
        console.log((<TextField>(this.workItemNumberField.nativeElement)).text);
        let workItemNumberTextFieldValue: string = (<TextField>(this.workItemNumberField.nativeElement)).text;

        if(workItemNumberTextFieldValue != this.workItemNumber) {
            this.workItemNumber = workItemNumberTextFieldValue;
            //console.log(this.workItemNumber);
        }
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