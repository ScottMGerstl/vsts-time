import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { Config } from "../../shared/config";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Http, Headers, Response } from "@angular/http";
import { WorkItem } from "./work-item.model";

@Injectable()
export class WorkItemService extends BaseService {

    constructor(private _http: Http) {
        super();
    }

    public updateTime() {

    }

    public getWorkItem(id: number): Observable<WorkItem> {
        let authToken: string = `Basic ${Config.token}`;
        let url: string = Config.apiUrl + `wit/workitems?ids=${id}&api-version=1.0`;

        let headers: Headers = new Headers();
        headers.append("Authorization", authToken);

        return this._http.get(url, { headers: headers })
        .map(res => res.json())
        .map(data => this.mapToWorkItem(data.value[0]))
        .catch(this.handleErrors);

        // return Observable.from([this.mapToWorkItem(this.repo[id])]);
    }

    private mapToWorkItem(data: any): WorkItem {
        let result = new WorkItem();

        if(data) {
            result.id = data.id;
            result.title = data.fields["System.Title"];
            result.type = data.fields["System.WorkItemType"];
            result.status = data.fields["System.State"];
            result.assignedTo = data.fields["System.AssignedTo"];
            result.originalEstimate = data.fields["Microsoft.VSTS.Scheduling.OriginalEstimate"];
            result.completedTime = data.fields["Microsoft.VSTS.Scheduling.CompletedWork"];
            result.remainingTime = data.fields["Microsoft.VSTS.Scheduling.RemainingWork"];
        }

        return result;
    }

    private repo: any[] = [{
            "id": 10939,
            "rev": 1,
            "fields": {
                "System.AreaPath": "Development\\Code Masons",
                "System.TeamProject": "Development",
                "System.IterationPath": "Development\\Crazy Happy Chewbacca",
                "System.WorkItemType": "Task",
                "System.State": "New",
                "System.Reason": "New",
                "System.CreatedDate": "2016-08-12T18:17:55.373Z",
                "System.CreatedBy": "Michael Ayres <mayres@bhtp.com>",
                "System.ChangedDate": "2016-08-12T18:17:55.373Z",
                "System.ChangedBy": "Michael Ayres <mayres@bhtp.com>",
                "System.Title": "Work with Calvin - Day 1",
                "Microsoft.VSTS.Scheduling.RemainingWork": 6,
                "Microsoft.VSTS.Common.Activity": "Development",
                "Microsoft.VSTS.Common.StateChangeDate": "2016-08-12T18:17:55.373Z",
                "Microsoft.VSTS.Common.Priority": 2,
                "Microsoft.VSTS.Scheduling.OriginalEstimate": 6,
                "Microsoft.VSTS.Scheduling.CompletedWork": 0,
                "System.Description": "Work with Calvin to gain knowledge on the reconciliation process."
            },
            "url": "https://bhsc.visualstudio.com/DefaultCollection/_apis/wit/workItems/10939"
        },
        {
            "id": 10663,
            "rev": 3,
            "fields": {
                "System.AreaPath": "Development\\Code Masons",
                "System.TeamProject": "Development",
                "System.IterationPath": "Development\\Whistle Tip - Bubb Rubb",
                "System.WorkItemType": "Task",
                "System.State": "Closed",
                "System.Reason": "Completed",
                "System.AssignedTo": "Joshua Werra <jwerra@bhtp.com>",
                "System.CreatedDate": "2016-08-01T14:06:58.433Z",
                "System.CreatedBy": "Erin Rasmussen <erasmussen@bhtp.com>",
                "System.ChangedDate": "2016-08-11T19:52:36.22Z",
                "System.ChangedBy": "Joshua Werra <jwerra@bhtp.com>",
                "System.Title": "Pull Request",
                "Microsoft.VSTS.Common.Activity": "Development",
                "Microsoft.VSTS.Common.StateChangeDate": "2016-08-11T19:52:36.22Z",
                "Microsoft.VSTS.Common.ClosedDate": "2016-08-11T19:52:36.22Z",
                "Microsoft.VSTS.Common.ClosedBy": "Joshua Werra <jwerra@bhtp.com>",
                "Microsoft.VSTS.Common.Priority": 2,
                "Microsoft.VSTS.Scheduling.OriginalEstimate": 1,
                "Microsoft.VSTS.Scheduling.CompletedWork": 1
            },
            "url": "https://bhsc.visualstudio.com/DefaultCollection/_apis/wit/workItems/10663"
        },
        {
            "id": 8868,
            "rev": 7,
            "fields": {
                "System.AreaPath": "Development\\Integrations",
                "System.TeamProject": "Development",
                "System.IterationPath": "Development\\Stone Cold Steve Austin",
                "System.WorkItemType": "User Story",
                "System.State": "Active",
                "System.Reason": "Implementation started",
                "System.AssignedTo": "Scott M Gerstl <sgerstl@bhtp.com>",
                "System.CreatedDate": "2016-05-19T21:06:13.29Z",
                "System.CreatedBy": "Scott M Gerstl <sgerstl@bhtp.com>",
                "System.ChangedDate": "2016-05-25T00:16:04.803Z",
                "System.ChangedBy": "Scott M Gerstl <sgerstl@bhtp.com>",
                "System.Title": "Keep Alive Pinger in SBX",
                "System.BoardColumn": "Development Doing",
                "System.BoardColumnDone": false,
                "System.BoardLane": "On Hold",
                "Microsoft.VSTS.Common.StateChangeDate": "2016-05-19T22:41:50.897Z",
                "Microsoft.VSTS.Common.ActivatedDate": "2016-05-19T22:41:50.897Z",
                "Microsoft.VSTS.Common.ActivatedBy": "Scott M Gerstl <sgerstl@bhtp.com>",
                "Microsoft.VSTS.Common.Priority": 2,
                "Microsoft.VSTS.Common.ValueArea": "Business",
                "Microsoft.VSTS.Common.StackRank": 1750000000,
                "WEF_F7AD577EB74C4A0F8C920FCAA03EA41D_Kanban.Column": "Development Doing",
                "WEF_F7AD577EB74C4A0F8C920FCAA03EA41D_Kanban.Column.Done": false,
                "WEF_F7AD577EB74C4A0F8C920FCAA03EA41D_Kanban.Lane": "On Hold",
                "System.History": "Associated with commit 71e1f91895573647ec45c5f1f122824a96183411"
            },
            "url": "https://bhsc.visualstudio.com/DefaultCollection/_apis/wit/workItems/8868"
        },
        {
            "id": 9429,
            "rev": 16,
            "fields": {
                "System.AreaPath": "Development\\Code Masons",
                "System.TeamProject": "Development",
                "System.IterationPath": "Development",
                "System.WorkItemType": "Bug",
                "System.State": "New",
                "System.Reason": "Investigation Complete",
                "System.CreatedDate": "2016-06-09T19:36:16.177Z",
                "System.CreatedBy": "Michael Ayres <mayres@bhtp.com>",
                "System.ChangedDate": "2016-07-01T17:00:28.35Z",
                "System.ChangedBy": "Michael Ayres <mayres@bhtp.com>",
                "System.Title": "Not requoting unless all travelers are valid",
                "System.BoardColumn": "New",
                "System.BoardColumnDone": false,
                "Microsoft.VSTS.Common.StateChangeDate": "2016-06-14T15:31:37.483Z",
                "Microsoft.VSTS.Common.Priority": 2,
                "Microsoft.VSTS.Common.Severity": "3 - Medium",
                "Microsoft.VSTS.Common.ValueArea": "Business",
                "Microsoft.VSTS.Scheduling.StoryPoints": 3,
                "Microsoft.VSTS.Common.StackRank": 54835250,
                "WEF_D31DDD48B1714568A006885D970A7974_Kanban.Column": "New",
                "WEF_D31DDD48B1714568A006885D970A7974_Kanban.Column.Done": false,
                "Microsoft.VSTS.TCM.ReproSteps": "<div><ul><li>Get to the traveler details screen, fill in primary traveler completely.</li><li>Add an additional traveler. &nbsp;leave it blank.</li><li>add another additional traveler and fill it in completely.</li></ul><div>Note that the price is not updated for AirCare or ExactCare. &nbsp;The system is not requoting because of the invalid (empty) traveler. &nbsp;If a traveler becomes valid and we have not quoted on it, yet, we should be requoting with only valid travelers.</div></div><div><br></div><div>In the case above, the primary traveler and the last traveler were completely entered.</div><div><br></div><div>Note that requoting does not happen if the primary traveler is missing information, also. &nbsp;As long as any traveler is empty or invalid for quoting, the system is not requoting.</div><div><br></div>",
                "System.Tags": "Fix For Release"
            },
            "url": "https://bhsc.visualstudio.com/DefaultCollection/_apis/wit/workItems/9429"
        }
    ];
}