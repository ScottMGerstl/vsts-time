import { Injectable } from "@angular/core";
import { Config } from "../../shared/config";
import { Observable } from "rxjs/Rx";
import { BaseService } from "../base.service";

import { Http, Headers, Response } from "@angular/http";

@Injectable()
export class WorkItemService extends BaseService {

    constructor(private _http: Http) {
        super();
    }

    public updateTime() {

    }

    public getWorkItem(id: number): Observable<any> {
        let headers = new Headers();
        headers.append("Authorization", `Basic ${Config.token}`);

        return this._http.get(
            Config.apiUrl + `wit/workitems?ids=${id}&api-version=1.0`,
            { headers: headers }
        )
        .map(res => res.json())
        .map(data => console.log(JSON.stringify(data)))
        .catch(this.handleErrors);
    }
}