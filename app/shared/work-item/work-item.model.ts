export class WorkItem {
    public id: number;
    public title: string;
    public type: string;
    public status: string;
    public assignedTo: string;
    public remainingTime: number;
    public completedTime: number;
    public originalEstimate: number;
}