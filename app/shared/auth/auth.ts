export { AuthService } from "./guts/auth.service";

import { StorageService } from "../storage/guts/storage.service";

export const AUTH_SERVICE_PROVIDERS: any[] = [
    {provide: StorageService, useFactory: storageServiceFactory }
];

/**
 * @experimental
 */
export function storageServiceFactory(): StorageService {
  return new StorageService();
}