import { SharedModule } from "app/shared/shared.module";
import { FuseAlertModule } from "@fuse/components/alert/alert.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { EmailVerificationComponent } from "./email-verification.component";

const routes = [
  {
    path: "verify-email",
    component: EmailVerificationComponent,
  },
  {
    path: "verify-email/:token",
    component: EmailVerificationComponent,
  },
];

@NgModule({
  declarations: [EmailVerificationComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseAlertModule,
    SharedModule
  ],
})
export class EmailVerificationModule {}
