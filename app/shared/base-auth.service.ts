import { Headers } from "@angular/http";
import { BaseService } from "./base.service";
import { AuthService } from "./auth/guts/auth.service";
import { User } from "./user/guts/user.model";
import { Config } from "./config";

export abstract class BaseAuthService extends BaseService {
    constructor(protected _auth: AuthService) {
        super();
    }

    /**
     * Creates a Headers object, adds the Authorization header and returns
     *
     * @protected
     * @returns {Headers} a headers object containing Authorization
     */
    protected getHeadersWithAuth(): Headers {
        let headers: Headers = new Headers();
        headers.append("Authorization", `Basic ${this._auth.authToken}`);

        return headers;
    }

    protected createUrl(endpoint: string): string {
        let url: string = Config.getApiUrl(this._auth.user.instance) + endpoint;
        return url;
    }

    protected getUserEmail(): string {
        return this._auth.user.email;
    }
}