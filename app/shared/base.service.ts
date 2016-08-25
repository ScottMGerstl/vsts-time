import { Injectable } from "@angular/core";
import { Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Config } from "../shared/config";

@Injectable()
export abstract class BaseService {

    /**
     * Creates a Headers object, adds the Authorization header and returns
     *
     * @protected
     * @returns {Headers} a headers object containing Authorization
     */
    protected getHeadersWithAuth(): Headers {
        let headers: Headers = new Headers();
        headers.append("Authorization", `Basic ${Config.token}`);

        return headers;
    }

    protected createUrl(endpoint: string): string {
        let url: string = Config.getApiUrl(Config.instance) + endpoint;
        return url;
    }

    protected getUserEmail(): string {
        return Config.userEmail;
    }

    protected handleObservableErrors(error: Response): Observable<any> {
        this.logError(error);
        return Observable.throw(error);
    }

    protected handleErrors(error: Response): void {
        this.logError(error);
    }

    private logError(error: Response): void {
        console.log(JSON.stringify(error.json()));
    }
}