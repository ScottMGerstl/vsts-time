import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
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
        return Observable.from([token]);
    }
}