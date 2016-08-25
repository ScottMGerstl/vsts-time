import { Injectable, Output, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Config } from "../../shared/config";
import { User } from "../user/user.model";
import { base64Encode } from "../../utils/base64.util";
import { BaseService } from "../base.service";

import { VstsService } from "../work-item/services/vsts.service";

@Injectable()
export class AuthService extends BaseService {

    @Output() public signInComplete: EventEmitter<any> = new EventEmitter(false);
    @Output() public signInFailed: EventEmitter<string> = new EventEmitter<string>(false);
    // @Output() public signOutComplete: EventEmitter<any> = new EventEmitter(false);

    private authFailedeMessage: string = "We could not locate your account. Check you information and try again";

    constructor(private _http: Http) {
        super();
    }

    public signIn(user: User): void {
        let queryString = `Select [System.Id] From WorkItems Where [System.AssignedTo] = '${user.email}'`;

        let url: string = Config.getApiUrl(user.instance) + `wit/wiql?api-version=1.0`;
        let body: any = { query: queryString };

        let headers: Headers = new Headers();
        headers.append("Authorization", "Basic " + this.makeToken(user));
        headers.append("Content-Type", "application/json");

        this._http.post(url, body, { headers: headers })
            .subscribe(
                (res: Response) => this.onSignInSuccess(res, user),
                (errorRes: Response) => this.onSignInFailure(errorRes)
            );
    }

    private onSignInSuccess(res: Response, user: User): void {
        if(res.status === 200) {
            let token: string = this.makeToken(user);

            Config.instance = user.instance;
            Config.token = token;
            Config.userEmail = user.email;

            this.signInComplete.emit(null);
        }
        else {
            this.signInFailed.emit(this.authFailedeMessage);
        }
    }

    private onSignInFailure(errorRes: Response): void {
       let errorMessage: string = "Something went wrong wile trying to log you in";

        if (errorRes.status === 401) {
            errorMessage = this.authFailedeMessage;
        }
        else {
            this.handleErrors(errorRes);
        }

        this.signInFailed.emit(errorMessage);
    }

    private makeToken(user: User): string {
        let token = base64Encode(`${user.email}:${user.password}`);
        return token;
    }
}