import { SharedModule } from "app/shared/shared.module";
import { FuseAlertModule } from "@fuse/components/alert/alert.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MobileVerificationComponent } from "./mobile-verification.component";
import { AuthGuard } from "app/core/auth/guards/auth.guard";

const routes = [
  {
    path: "verify-mobile",
    canActivate: [AuthGuard],
    component: MobileVerificationComponent,
  }
];

@NgModule({
  declarations: [MobileVerificationComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseAlertModule,
    SharedModule
  ]
})
export class MobileVerificationModule {}
