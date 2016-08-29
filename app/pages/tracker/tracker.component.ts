import { Component, NgZone, ElementRef, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { convertMsToRoundedHours, convertMsToReadableTime } from "../../shared/time/time-conversions";
import { InputTimer } from "../../shared/time/input-timer";
import { TimeTrackerComponent } from "../../components/time-tracker/time-tracker.component";

import { TextField } from "ui/text-field";

import { WorkItem, WorkItemService, WORK_ITEM_PROVIDERS } from "../../shared/work-item/work-item";
import { AuthService, AUTH_SERVICE_PROVIDERS } from "../../shared/auth/auth";

import * as Rx from "rxjs";

@Component({
    selector: "tracker",
    providers: [WorkItemService, WORK_ITEM_PROVIDERS, AuthService, AUTH_SERVICE_PROVIDERS],
    directives: [TimeTrackerComponent],
    templateUrl: "pages/tracker/tracker.html",
    styleUrls: ["pages/tracker/tracker-common.css", "pages/tracker/tracker.css"]
})
export class TrackerPage implements OnInit, OnDestroy {

    @ViewChild("workItemNumberField") private workItemNumberField: ElementRef;
    @ViewChild(TimeTrackerComponent) private timeTracker: TimeTrackerComponent;

    private signOutSubscription: Rx.Subscription;

    private setupSignOutSubscription(): void {
        this.signOutSubscription = this._auth.signOutComplete.subscribe(() => this._router.navigate(["/sign-in"], { clearHistory: true }));
    }

    private tearDownSignOutSubscription(): void {
        if (this.signOutSubscription !== null && this.signOutSubscription.isUnsubscribed === false) {
            this.signOutSubscription.unsubscribe();
        }
    }

    public ngOnInit(): void {
        this.setupSignOutSubscription();
    }

    public ngOnDestroy(): void {
        this.tearDownSignOutSubscription();
    }

    // Work Item vars
    private workItemNumber: string;
    private workItemInputWaitTimer: InputTimer;
    private workItem: WorkItem;

    // Time display
    private ellapsedTime: string;

    // history
    private timeLog: List<any>;

    // user work items
    private userWorkItems: WorkItem[];

    constructor(private _zone: NgZone, private _workItemLogic: WorkItemService, private _auth: AuthService, private _router: RouterExtensions) {
        this.workItemInputWaitTimer = new InputTimer(() => this.retrieveWorkItem(), 700);
        this.timeLog = [];
        this.resetTimerDisplay();
    }

    private signOut(event: any): void {
        this._auth.signOut();
    }

    private onTimerStarted(): void {
        this.dismissKeyboard(this.workItemNumberField);
        this.updateTimerDisplay(0);
    }

    private onTimerStopped(millisecondsEllapsed: number): void {
        if (this.workItem) {
            this.addTimeToHistory(millisecondsEllapsed);
            this._workItemLogic.updateWorkItem(this.workItem, millisecondsEllapsed)
            .subscribe(
                (savedWorkItem) => this.workItem = savedWorkItem,
                (errorMessage) => alert(errorMessage)
            );
        }
    }

    private onTimerTicked(millisecondsEllapsed: number): void {
        this.updateTimerDisplay(millisecondsEllapsed);
    }

    private resetTimerDisplay(): void {
        this.updateTimerDisplay(null);
    }

    private updateTimerDisplay(millisecondsEllapsed: number): void {
        let displayValue: string = "--:--";

        if (millisecondsEllapsed !== null && millisecondsEllapsed !== undefined) {
            displayValue = convertMsToReadableTime(millisecondsEllapsed);
        }

        this._zone.run(() => this.ellapsedTime = displayValue);
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