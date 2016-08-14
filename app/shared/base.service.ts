import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";


@Injectable()
export abstract class BaseService {
    protected handleErrors(error: Response): Observable<any> {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}