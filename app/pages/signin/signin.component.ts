import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/auth/auth.service";

import { User } from "../../shared/user/user.model";
import { Page } from "ui/page";

declare var btoa: Function;

@Component({
  selector: "login",
  providers: [AuthService],
  templateUrl: "pages/signin/signin.html",
  styleUrls: ["pages/signin/signin-common.css", "pages/signin/signin.css"]
})
export class SignInPage implements OnInit {

  private user: User;

  constructor(private _authService: AuthService, private _router: Router, private _page: Page) {
    this.user = new User();
    this.user.password = "bhTravel528*";
    // this.user.email = "sgerstl@bhtp.com";
    // this.user.instance = "bhsc";
  }

  public ngOnInit(): void {
    this._page.actionBarHidden = true;
  }

  private submit(): void {
    this.login();
  }

  private login(): void {
      this._authService.getToken(this.user).subscribe(
          (token) => this._router.navigate(["/tracker"]),
          (error) => alert("Unfortunately, we could not find your account.")
      );
  }
}