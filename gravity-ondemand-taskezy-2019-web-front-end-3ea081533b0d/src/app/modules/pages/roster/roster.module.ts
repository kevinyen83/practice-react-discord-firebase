import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MY_FORMATS } from '../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CalendarDayModule, CalendarModule, CalendarMonthModule, CalendarWeekModule } from 'angular-calendar';
// import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { RosterComponent } from './roster.component';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';
import { CopyShiftComponent } from './copy-shift/copy-shift.component';
import { ReleaseRosterComponent } from './release-roster/release-roster.component';
import { ExcelService } from './excel.service';
import { ShiftFormComponent } from './shift-form/shift-form.component';
import { FiltersRosterComponent } from './filters-roster/filters-roster.component';
import { CalendarService } from './calendar.service';
import { SharedModule } from '../../../shared/shared.module';
import { EventWeekTemplateComponent } from './angular-calendar-components/event-week-template/event-week-template.component';
import { OrderByPipe } from 'ngx-pipes';

import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { NgxTimeSchedulerModule } from 'ngx-time-scheduler-extend';

import { ShiftChangelogComponent } from './shift-changelog/shift-changelog.component';
import { EventDayTemplateComponent } from './angular-calendar-components/event-day-template/event-day-template.component';
import { CellTemplateComponent } from './angular-calendar-components/cell-template/cell-template.component';
import { OpenDayEventsTemplateComponent } from './angular-calendar-components/open-day-events-template/open-day-events-template.component';
import { FiltersOfRosterHeaderComponent } from './filters-of-roster-header/filters-of-roster-header.component';
import { AccreditationsRequiredComponent } from './accreditations-required/accreditations-required.component';
import { CommonViewModule } from '../../common/common-view.module';
import { SearchByUsersComponent } from './search-by-users/search-by-users.component';
import { TaskChecklistComponent } from './task-checklist/task-checklist.component';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { AddRoleWindowComponent } from './add-role-window/add-role-window.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DatetimeAdapter, MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { MomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { CalendarWeekViewAllDayComponent } from './angular-calendar-components/calendar-week-view-all-day/calendar-week-view-all-day.component';
import { WeekClientHeaderTemplateComponent } from './angular-calendar-components/week-client-header-template/week-client-header-template.component';
import { WeekVenueHeaderTemplateComponent } from './angular-calendar-components/week-venue-header-template/week-venue-header-template.component';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { SelectedIndicatorComponent } from './selected-indicator/selected-indicator.component';
import {MatChipsModule} from "@angular/material/chips";
import {FuseAlertModule} from "../../../../@fuse/components/alert";
import { TaskComponent } from './task/task.component';
import { ChangeResourceComponent } from './change-resource/change-resource.component';

const routes: Routes = [
  {
    path: '',
    component: RosterComponent
  },
  {
    path: ':id',
    component: EditShiftComponent
  },
  {
    path: 'add',
    component: AddShiftComponent
  },
  {
    path: 'add/:data',
    component: AddShiftComponent
  }
];

@NgModule({
  declarations: [
    RosterComponent,
    AddShiftComponent,
    EditShiftComponent,
    CopyShiftComponent,
    ReleaseRosterComponent,
    ShiftChangelogComponent,
    ShiftFormComponent,
    FiltersRosterComponent,
    EventWeekTemplateComponent,
    EventDayTemplateComponent,
    ShiftDetailsComponent,
    CellTemplateComponent,
    WeekClientHeaderTemplateComponent,
    WeekVenueHeaderTemplateComponent,
    OpenDayEventsTemplateComponent,
    AccreditationsRequiredComponent,
    SearchByUsersComponent,
    TaskChecklistComponent,
    FiltersOfRosterHeaderComponent,
    AddRoleWindowComponent,
    CalendarWeekViewAllDayComponent,
    SelectedIndicatorComponent,
    TaskComponent,
    ChangeResourceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonViewModule,
    CalendarModule,
    ContextMenuModule,
    MtxDatetimepickerModule,
    MtxGridModule,
    MatChipsModule,
    CalendarMonthModule,
    CalendarDayModule,
    CalendarWeekModule,
    DragDropModule,
    NgxTimeSchedulerModule,
    FuseScrollbarModule,
    FuseAlertModule,
    MatDialogModule,
    MatInputModule
  ],
  exports: [
    RosterComponent,
    AddShiftComponent,
    EditShiftComponent,
    ReleaseRosterComponent,
    CalendarWeekViewAllDayComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    ExcelService,
    CalendarService,
    OrderByPipe,
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
export class RosterModule {}
