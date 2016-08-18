export { WorkItem, WorkItemFieldDefinitions, WorkItemStatuses, WorkItemTypes } from "./models/work-item.model";
export { WorkItemLogic } from "./logic/work-item.logic"

import { provide } from "@angular/core";
import { Http } from "@angular/http";
import { VstsService } from "./services/vsts.service"

export const WORK_ITEM_PROVIDERS: any[] = [
    {provide: VstsService, useFactory: vstsServiceFactory, deps:[Http] }
];

/**
 * @experimental
 */
export function vstsServiceFactory(http: Http): VstsService {
  return new VstsService(http);
}