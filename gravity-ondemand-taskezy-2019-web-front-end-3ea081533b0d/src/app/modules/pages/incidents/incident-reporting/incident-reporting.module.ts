import { SharedModule } from "app/shared/shared.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { IncidentReportingComponent } from "./incident-reporting.component";
import { FiltersIncidentsComponent } from "../filters-incidents/filters-incidents.component";
import { CalendarModule } from "angular-calendar";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { IncidentReportComponent } from "../incident-report/incident-report.component";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "app/modules/authentication/register/register.module";
import { DatetimeAdapter, MTX_DATETIME_FORMATS } from "@ng-matero/extensions/core";
import { MomentDatetimeAdapter } from "@ng-matero/extensions-moment-adapter";

const routes: Routes = [
  {
    path: "",
    component: IncidentReportingComponent,
  },
  {
    path: "report",
    component: IncidentReportComponent,
  },
];


@NgModule({
  declarations: [
    IncidentReportingComponent,
    IncidentReportComponent,
    FiltersIncidentsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CalendarModule,
    NgxMaterialTimepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter
    },
    {
      provide: MTX_DATETIME_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY-MM-DD',
          monthInput: 'MMMM',
          timeInput: 'HH:mm',
          datetimeInput: 'YYYY-MM-DD HH:mm'
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthInput: 'MMMM',
          timeInput: 'HH:mm',
          datetimeInput: 'YYYY-MM-DD HH:mm',
          monthYearLabel: 'YYYY MMMM',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
          popupHeaderDateLabel: 'MMM DD, ddd'
        }
      }
    }
  ]
})
export class IncidentReportingModule {}
