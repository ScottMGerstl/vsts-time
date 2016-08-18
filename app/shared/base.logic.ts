import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Config } from "../shared/config";

@Injectable()
export abstract class BaseLogic {

    protected getUserEmail(): string {
        return Config.userEmail;
    }

    protected handleErrors(error: Response): Observable<any> {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}