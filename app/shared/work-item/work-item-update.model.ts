import { VstsFieldDefinitions } from "./vsts-field-definitions";

export class WorkItemUpdate {
    public op: string;
    public path: string;
    public value: any;

    constructor(path: string, value: any) {
        this.op = "replace";
        this.path = "/fields/" + path;
        this.value = value;
    }
}

export class WorkItemUpdateList {

    private updateDefinition: WorkItemUpdate[];

    constructor() {
        this.updateDefinition = [];
    }

    public resolveToArray(): WorkItemUpdate[] {
        return this.updateDefinition;
    }

    /**
     * Adds the completed time field to the updates
     *
     * @param {number} time The new time to record
     */
    public addCompletedTime(time: number): void {
        this.updateDefinition.push(new WorkItemUpdate(VstsFieldDefinitions.completedTimeField, time));
    }

    /**
     * Adds the remaining time field to the updates
     *
     * @param {number} time The new time to record
     */
    public addRemainingTime(time: number): void {
        this.updateDefinition.push(new WorkItemUpdate(VstsFieldDefinitions.remainingTimeField, time));
    }

    /**
     * Adds the status field to the updates
     *
     * @param {string} status The desired status
     */
    public addStatus(status: string) {
        this.updateDefinition.push(new WorkItemUpdate(VstsFieldDefinitions.statusField, status));
    }
}