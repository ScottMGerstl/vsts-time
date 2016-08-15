import { nativeScriptBootstrap } from "nativescript-angular/application";
import "reflect-metadata";
import { HTTP_PROVIDERS } from "@angular/http";
import { AppComponent } from "./app.component";
import { APP_ROUTER_PROVIDERS } from "./app.routes";
import {Parse5DomAdapter} from '@angular/platform-server/src/parse5_adapter';

(<any>Parse5DomAdapter).prototype.getCookie = function (name) { return null; };

nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS, APP_ROUTER_PROVIDERS]);