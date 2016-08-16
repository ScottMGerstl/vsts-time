import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Config } from "../../shared/config";
import { User } from "../user/user.model";
import { base64Encode } from "../../utils/base64.util";

@Injectable()
export class AuthService {

    /**
     * gets the auth token for the user
     *
     * @param {User} user
     * @returns {string} the token used to make api calls for the user
     */
    public getToken(user: User): Observable<string>
    {
        let token = base64Encode(`${user.email}:${user.password}`);
        Config.instance = user.instance;
        Config.token = token;
        Config.userEmail = user.email;

        return Observable.from([token]);
    }
}