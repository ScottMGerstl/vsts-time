import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Config } from "../shared/config";
import { Headers } from "@angular/http";

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
        let url: string = Config.apiUrl + endpoint;
        return url;
    }

    protected handleErrors(error: Response): Observable<any> {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}