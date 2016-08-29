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

export class WorkItemFieldDefinitions {
    public static Title: string = "System.Title";
    public static Type: string = "System.WorkItemType";
    public static Status: string = "System.State";
    public static AssignedTo: string = "System.AssignedTo";
    public static OriginalEstimate: string = "Microsoft.VSTS.Scheduling.OriginalEstimate";
    public static CompletedTime: string = "Microsoft.VSTS.Scheduling.CompletedWork";
    public static RemainingTime: string = "Microsoft.VSTS.Scheduling.RemainingWork";
}

export class WorkItemStatuses {
    public static New: string = "New";
    public static Active: string = "Active";
    public static Resolved: string = "Resolved";
    public static Closed: string = "Closed";
}

export class WorkItemTypes {
    public static UserStory: string = "User Story";
    public static Bug: string = "Bug";
    public static Task: string = "Task"
}