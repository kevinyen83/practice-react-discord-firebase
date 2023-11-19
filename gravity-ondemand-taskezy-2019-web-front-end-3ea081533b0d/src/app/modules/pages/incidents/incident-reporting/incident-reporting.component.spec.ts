import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IncidentReportingComponent } from './incident-reporting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FiltersIncidentsComponent } from '../filters-incidents/filters-incidents.component';
import { CalendarDayModule, CalendarModule, CalendarMonthModule, CalendarWeekModule, DateAdapter } from 'angular-calendar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { MomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { DatetimeAdapter, MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { MY_FORMATS } from '../../primary-account/details-page/primary-account-details.module';

describe('IncidentReportingComponent', () => {
  let component: IncidentReportingComponent;
  let fixture: ComponentFixture<IncidentReportingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        CalendarModule,
        CalendarMonthModule,
        CalendarDayModule,
        CalendarWeekModule,
      ],
      declarations: [ IncidentReportingComponent, FiltersIncidentsComponent ],
      providers:[
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
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
