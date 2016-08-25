import { Component } from "@angular/core";

import { Page } from "ui/page";
import { TextField } from "ui/text-field";

import * as Rx from "rxjs";

declare var android: any;

export abstract class BasePage {

    constructor(protected _page: Page) { }

    protected setHintColor(textField: TextField): void {
        textField.android.setHintTextColor(android.graphics.Color.parseColor("#CCCCCC"));
    }

    protected setTextFieldUnderlineValidity(textField: TextField, valid: boolean): void {
        if (valid === true) {
            this.clearUnderlineError(textField);
        }
        else {
            this.setUnderlineError(textField);
        }
    }

    private setUnderlineError(textField: TextField): void {
        textField.android.getBackground().setColorFilter(android.graphics.Color.parseColor("#D50000"), android.graphics.PorterDuff.Mode.SRC_IN);
    }

    private clearUnderlineError(textField: TextField): void {
        textField.android.getBackground().clearColorFilter();
    }

    protected unsubscribeAll(...subscriptions: Rx.Subscription[]): void {
        subscriptions.forEach(s => this.unsubscribe(s));
    }

    protected unsubscribe(subscription: Rx.Subscription): void {
        if (subscription && subscription.isUnsubscribed === false) {
            subscription.unsubscribe();
        }
    }
}