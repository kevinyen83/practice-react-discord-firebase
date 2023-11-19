import { SharedModule } from "app/shared/shared.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ResetPasswordComponent } from "./reset-password.component";
import { FuseAlertModule } from "@fuse/components/alert";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";

const routes = [
  {
    path: "reset-password",
    canActivate: [NoAuthGuard],
    component: ResetPasswordComponent,
  },
  {
    path: "reset-password/:token",
    canActivate: [NoAuthGuard],
    component: ResetPasswordComponent,
  },
];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FuseAlertModule
  ],
})
export class ResetPasswordModule {}
