import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CalendarModule } from "angular-calendar";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { NgxTimeSchedulerModule } from "ngx-time-scheduler-extend";

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

import { TimesheetRegisterComponent } from "./timesheet-register.component";
import { SharedModule } from "../../../shared/shared.module";
import { ShiftDescriptionComponent } from "./shift-description/shift-description.component";
import { ShiftFilterComponent } from "./shift-filter/shift-filter.component";
import { ShiftActivityComponent } from "./shift-activity/shift-activity.component";
import { TimesheetTableUsersComponent } from './timesheet-table-users/timesheet-table-users.component';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../primary-account/details-page/primary-account-details.module";

const routes: Routes = [
  {
    path: "",
    component: TimesheetRegisterComponent,
  },
];

@NgModule({
  declarations: [
    TimesheetRegisterComponent,
    ShiftDescriptionComponent,
    ShiftFilterComponent,
    ShiftActivityComponent,
    TimesheetTableUsersComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CalendarModule,
    NgxMaterialTimepickerModule,
    NgxTimeSchedulerModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class TimesheetRegisterModule {}
