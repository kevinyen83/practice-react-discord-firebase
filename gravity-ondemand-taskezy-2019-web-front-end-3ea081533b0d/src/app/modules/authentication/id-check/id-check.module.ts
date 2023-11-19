import { SharedModule } from "app/shared/shared.module";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FuseAlertModule } from "@fuse/components/alert";

import { IDCheckComponent } from "./id-check.component";
import { AuthGuard } from "app/core/auth/guards/auth.guard";

const routes = [
  {
    path: "id-check",
    component: IDCheckComponent
  },
  {
    path: "id-check/:token",
    component: IDCheckComponent,
  },
];

@NgModule({
  declarations: [IDCheckComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FuseAlertModule
  ],
  exports: [IDCheckComponent],
})
export class IDCheckModule {}
