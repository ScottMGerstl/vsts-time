import { Injectable } from "@angular/core";
import * as appSettings from "application-settings";
import { User } from "../../user/guts/user.model";

enum Keys {
    authToken,
    user
}

export class StorageService {

    public set authToken(token: string) {
        this.setValue(Keys.authToken, token);
    }

    public get authToken(): string {
        return this.getValue<string>(Keys.authToken);
    }

    public removeAuthToken(): void {
        this.removeValue(Keys.authToken);
    }

    public set user(user: User) {
        // remove password before save
        let dataToSave: User = Object.assign({}, user);
        dataToSave.password = null;

        this.setValue(Keys.user, dataToSave);
    }

    public get user(): User {
        return this.getValue<User>(Keys.user);
    }

    public removeUser(): void {
        this.removeValue(Keys.user);
    }

    private getValue<T>(key: Keys): T {
        let rawValue: string = appSettings.getString(this.withKeyName(key));

        if (rawValue === null || rawValue === undefined) {
            return null;
        }

        return <T>JSON.parse(rawValue);
    }

    private setValue<T>(key: Keys, value: T): void {
        if (value === null || value === undefined) {
            throw Error("Value cannot be null. If you wish to remove the value, use removeValue() instead");
        }

        let stringifiedValue: string = JSON.stringify(value);

        appSettings.setString(this.withKeyName(key), stringifiedValue);
    }

    private removeValue(key: Keys): void {
        appSettings.remove(this.withKeyName(key));
    }

    private withKeyName(key: Keys): string {
        return Keys[key];
    }
}