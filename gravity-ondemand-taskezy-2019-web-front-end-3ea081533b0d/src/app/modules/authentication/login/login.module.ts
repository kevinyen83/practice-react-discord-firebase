import { SharedModule } from "app/shared/shared.module";
import { FuseAlertModule } from "@fuse/components/alert/alert.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { LoginComponent } from "./login.component";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";

const routes = [
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },
  {
    path: "login",
    canActivate: [NoAuthGuard],
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FuseAlertModule
  ],
  providers: [
    // AuthGuard
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
