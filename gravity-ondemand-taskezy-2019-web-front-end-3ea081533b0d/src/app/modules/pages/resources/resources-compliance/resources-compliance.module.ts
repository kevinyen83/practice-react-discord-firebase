import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { ResourcesComplianceComponent } from './resources-compliance.component';

const routes: Routes = [
  {
    path     : '',
    component: ResourcesComplianceComponent
  }
];

@NgModule({
  declarations: [
    ResourcesComplianceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ResourcesComplianceModule { }
