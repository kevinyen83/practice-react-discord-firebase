import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MY_FORMATS } from '../../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FuseAlertModule } from '@fuse/components/alert';
import { CalendarDayModule, CalendarMonthModule, CalendarWeekModule } from 'angular-calendar';
import { MatSortModule } from '@angular/material/sort';

import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { ListResourcesComponent } from './list-resources.component';
import { CreateResourceComponent } from './create-resource/create-resource.component';
import { SubAccountFormModule } from '../../../common/sub-accounts/sub-account-form/sub-account-form.module';
import { ExcelService } from '../../roster/excel.service';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonViewModule } from '../../../common/common-view.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListResourcesComponent
  },
  // {
  //   path: ':create',
  //   component: CreateResourceComponent,
  //   canActivate: [ AuthGuard ]
  // },
  // {
  //   path: 'invite',
  //   component: InviteResourceComponent,
  //   canActivate: [ AuthGuard ]
  // },
  {
    path: ':id',
    component: CreateResourceComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    ListResourcesComponent,
    CreateResourceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    SubAccountFormModule,
    FuseAlertModule,
    MatSortModule,
    CommonViewModule,
    CalendarMonthModule,
    CalendarDayModule,
    CalendarWeekModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ExcelService
  ]
})
export class ListResourcesModule {}
