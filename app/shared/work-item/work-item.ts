export { WorkItem, WorkItemFieldDefinitions, WorkItemStatuses, WorkItemTypes } from "./guts/work-item.model";
export { WorkItemService } from "./guts/work-item.service";

import { provide } from "@angular/core";
import { Http } from "@angular/http";
import { AuthService } from "../auth/guts/auth.service";
import { VstsService } from "./guts/vsts.service"

export const WORK_ITEM_PROVIDERS: any[] = [
    {provide: VstsService, useFactory: vstsServiceFactory, deps:[AuthService, Http] }
];

/**
 * @experimental
 */
export function vstsServiceFactory(auth: AuthService, http: Http): VstsService {
  return new VstsService(auth, http);
}