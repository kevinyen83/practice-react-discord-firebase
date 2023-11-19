import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

import { RosterComponent } from './roster.component';
// import { FuseSharedModule } from '../../../../@fuse/shared.module';
// import { FuseSearchBarModule, FuseShortcutsModule, FuseSidebarModule } from '../../../../@fuse/components';
import { ExcelService } from './excel.service';
// import { fuseConfig } from '../../../fuse-config';
import { CalendarService } from './calendar.service';
import { OrderByPipe } from 'ngx-pipes';
import { CalendarDayModule, CalendarModule, CalendarMonthModule, CalendarWeekModule, DateAdapter } from 'angular-calendar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { DatetimeAdapter, MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { MY_FORMATS } from '../primary-account/details-page/primary-account-details.module';
import { By } from "@angular/platform-browser";

const moment = extendMoment(Moment);

describe('RosterComponent', () => {
  let component: RosterComponent;
  let fixture: ComponentFixture<RosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NgxMatSelectSearchModule,
        SharedModule,
        RouterTestingModule.withRoutes([]),
        CalendarModule,
        ContextMenuModule,
        MtxDatetimepickerModule,
        MtxGridModule,
        CalendarMonthModule,
        CalendarDayModule,
        CalendarWeekModule,
        DragDropModule
      ],
      declarations: [RosterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ExcelService,
        CalendarService,
        OrderByPipe,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { profile: { uuid: 'b781e3c1-1f2c-4e8d-9937-ac91c40583db' } } } }
        },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check the change of weeks in the calendar', () => {
    let week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let days = fixture.debugElement.queryAll(By.css('cal-header'));
    days.forEach((day, index) => {
      expect(day.query(By.css('b')).nativeElement.textContent).toBe(week[index]);
    })
    let duration = 0;
    component.shifts.forEach((shift) => {
      duration = shift?.duration + duration;
    });
    let hours = duration / 60;
    let displayedHours = fixture.debugElement.queryAll(By.css('.count-hours'));
    let allHours = 0;
    displayedHours.forEach(hour => {
      allHours = Number(hour.nativeElement.textContent) + allHours;
    });
    expect(hours).toBe(allHours);
  });

  it('check disabled Create Shift button', () => {
    let isDisabled = true;
    if (component.currentAccount?.payment_instruments) {
      isDisabled = !component.currentAccount?.payment_instruments?.some(p => p.valid);
    }
    if (isDisabled) {
      expect(fixture.debugElement.nativeElement.querySelector('button[data-cy="create-shift"]').disabled).toBeTruthy();
    }
  });

  // it('Set Date work', () => {
  // component.currentDate = moment('2020-01-01');
  // component.currentAccount = {
  //   uuid: "test-uuid"
  // };
  // component.setDate();
  // expect(component.currentWeek.length).toEqual(7);
  // expect(component.currentWeek[0].mDate.format('YYYYMMDD')).toBe('20191230');
  // });
});
