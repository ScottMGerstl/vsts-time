import { Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { AuthService } from "../shared/auth/auth";

export abstract class BaseService {

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