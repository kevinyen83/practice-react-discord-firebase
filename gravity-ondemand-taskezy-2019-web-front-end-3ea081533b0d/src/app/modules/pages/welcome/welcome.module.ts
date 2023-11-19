import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../../../shared/shared.module';
import { CommonViewModule } from "../../common/common-view.module";

const routes = [
  {
    path     : '',
    component: WelcomeComponent
  }
];

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonViewModule,
  ]
})
export class WelcomeModule { }
