import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';

import { SubAccountFormComponent } from './sub-account-form.component';
import { CommonViewModule } from '../../common-view.module';

@NgModule({
  declarations: [ SubAccountFormComponent ],
  imports: [
    SharedModule,
    CommonViewModule
  ],
  exports: [
    SubAccountFormComponent
  ]
})
export class SubAccountFormModule { }
