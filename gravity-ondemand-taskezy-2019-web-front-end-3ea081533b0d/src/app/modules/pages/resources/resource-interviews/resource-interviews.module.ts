import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

// import { StarRatingModule } from 'angular-star-rating';
// import { SignaturePadModule } from 'angular2-signaturepad';
import { MY_FORMATS } from '../../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { ResourceInterviewsComponent } from './resource-interviews.component';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { ContinueInterviewComponent } from './add-interview/continue-interview/continue-interview.component';

const routes: Routes = [
  {
    path     : '',
    component: ResourceInterviewsComponent
  }
];

@NgModule({
  declarations: [
    ResourceInterviewsComponent,
    AddInterviewComponent,
    ContinueInterviewComponent
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
export class ResourceInterviewsModule { }
