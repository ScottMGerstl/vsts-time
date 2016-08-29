import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { AuthService, AUTH_SERVICE_PROVIDERS } from "../../shared/auth/auth";

import { BasePage } from "../base-page.component";

import { User } from "../../shared/user/user";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";

import * as Rx from "rxjs";

var emailValidator = require("email-validator");
declare var android: any;

@Component({
  selector: "login",
  providers: [AuthService, AUTH_SERVICE_PROVIDERS],
  templateUrl: "pages/signin/signin.html",
  styleUrls: ["pages/signin/signin-common.css", "pages/signin/signin.css"]
})
export class SignInPage extends BasePage implements OnInit, OnDestroy {

  @ViewChild("instance") private instance: ElementRef;
  @ViewChild("email") private email: ElementRef;
  @ViewChild("password") private password: ElementRef;

  private instanceError: string;
  private emailError: string;
  private passwordError: string;

  private user: User;

  private isSigningIn: boolean;
  private signInCompleteSubscription: Rx.Subscription;
  private signInFailedSubscription: Rx.Subscription;

  constructor(protected _page: Page, private _zone: NgZone, private _authService: AuthService, private nav: RouterExtensions) {
    super(_page);

    this.user = new User();
  }

  public ngOnInit(): void {
    this.isSigningIn = false;

    this.setUiStyles();
    this.setupAuthSubscriptions();
  }

  public ngOnDestroy(): void {
    this.tearDownAuthSubscriptions();
  }

  private onSignInTapped(): void {
    if (this.validate() === true) {
      this.signIn();
    }
  }

  private signIn(): void {
    this.isSigningIn = true;
    this._authService.signIn(this.user);
  }

  private onSignInComplete(): void {
    this.nav.navigate(["/tracker"], { clearHistory: true });
  }

  private onSignInFailed(errorMessage: string): void {
    this.isSigningIn = false;
    alert(errorMessage);
  }

  private validate(): boolean {
    let instanceValid: boolean = this.validateInstance();
    let emailValid: boolean = this.validateEmail();
    let passwordValid: boolean = this.validatePassword();

    return instanceValid && emailValid && passwordValid;
  }

  private validateInstance(): boolean {

    let textField: TextField = <TextField>this.instance.nativeElement;

    let result: boolean = this.hasValue(textField);

    this.setTextFieldUnderlineValidity(textField, result);

    let errorText = result === true ? null : "Instance is required";
    this._zone.run(() => this.instanceError = errorText);

    return result;
  }

  private validateEmail(): boolean {

    let textField: TextField = <TextField>this.email.nativeElement;

    let result: boolean = this.hasValue(textField);
    let errorText: string = null;

    if (result === true) {
      result = emailValidator.validate(textField.text) === true;

      if (result === false) {
        errorText = "Email must be valid";
      }
    }
    else {
      errorText = "Email is required";
    }

    this.setTextFieldUnderlineValidity(textField, result);

    this._zone.run(() => this.emailError = errorText);

    return result;
  }

  private validatePassword(): boolean {

    let textField: TextField = <TextField>this.password.nativeElement;

    let result: boolean = this.hasValue(textField);

    this.setTextFieldUnderlineValidity(textField, result);

    let errorText = result === true ? null : "Password is required";
    this._zone.run(() => this.passwordError = errorText);

    return result;
  }

  private setUiStyles(): void {
    this._page.actionBarHidden = true;

    let instanceField = (<TextField>this.instance.nativeElement);
    this.setHintColor(instanceField);

    let emailField = (<TextField>this.email.nativeElement);
    this.setHintColor(emailField);

    let passwordField = (<TextField>this.password.nativeElement);
    this.setHintColor(passwordField);
  }

  private setupAuthSubscriptions(): void {
    this.signInCompleteSubscription = this._authService.signInComplete.subscribe(() => this.onSignInComplete());
    this.signInFailedSubscription = this._authService.signInFailed.subscribe((errorMessage: string) => this.onSignInFailed(errorMessage));
  }

  private tearDownAuthSubscriptions(): void {
    this.unsubscribeAll(this.signInCompleteSubscription, this.signInFailedSubscription);
  }

  private hasValue(textField: TextField): boolean {
    return textField.text !== null && textField.text !== undefined && textField.text.length > 0;
  }

  private parseTextField(ref: ElementRef): TextField {
    return <TextField>ref.nativeElement;
  }
}