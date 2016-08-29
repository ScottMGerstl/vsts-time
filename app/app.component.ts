import { Component, OnInit } from "@angular/core";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from "nativescript-angular/router";
import { Router } from "@angular/router";
import { AuthService, AUTH_SERVICE_PROVIDERS } from "./shared/auth/auth";

@Component({
  selector: "main",
  providers: [AuthService, AUTH_SERVICE_PROVIDERS],
  directives: [NS_ROUTER_DIRECTIVES],
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent implements OnInit {

  constructor(private _authService: AuthService, private _router: RouterExtensions) {}

  public ngOnInit(): void {
    if(this._authService.isSignedIn === true) {
      this._router.navigate(["/tracker"]);
    }
    else {
      this._router.navigate(["/sign-in"]);
    }
  }
}