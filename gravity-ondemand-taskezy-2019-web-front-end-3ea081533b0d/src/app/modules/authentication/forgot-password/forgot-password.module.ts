import { SharedModule } from "app/shared/shared.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ForgotPasswordComponent } from "./forgot-password.component";
import { FuseAlertModule } from "@fuse/components/alert";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";

const routes = [
  {
    path: "forgot-password",
    canActivate: [NoAuthGuard],
    component: ForgotPasswordComponent,
  },
];

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FuseAlertModule
  ],
})
export class ForgotPasswordModule {}
