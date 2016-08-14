import { RouterConfig } from "@angular/router";
import { nsProvideRouter } from "nativescript-angular/router";
import { SignInPage } from "./pages/signin/signin.component";
import { TrackerPage } from "./pages/tracker/tracker.component";

export const routes: RouterConfig = [
    { path: "", component: SignInPage },
    { path: "tracker", component: TrackerPage }
];

export const APP_ROUTER_PROVIDERS = [
    nsProvideRouter(routes, {})
];