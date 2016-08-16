/**
 * A class containing the field names for interacting with VSTS work items
 *
 * @export
 * @class VstsFieldDefinitions
 */
export class VstsFieldDefinitions {
    public static titleField: string = "System.Title";
    public static typeField: string = "System.WorkItemType";
    public static statusField: string = "System.State";
    public static assignedToField: string = "System.AssignedTo";
    public static originalEstimateField: string = "Microsoft.VSTS.Scheduling.OriginalEstimate";
    public static completedTimeField: string = "Microsoft.VSTS.Scheduling.CompletedWork";
    public static remainingTimeField: string = "Microsoft.VSTS.Scheduling.RemainingWork";
}