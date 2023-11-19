import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimesheetRegisterComponent } from './timesheet-register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonViewModule } from 'app/modules/common/common-view.module';
import { TimesheetRegisterModule } from './timesheet-register.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from 'angular-calendar';
import { MY_FORMATS } from '../primary-account/details-page/primary-account-details.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TimesheetRegisterComponent', () => {
  let component: TimesheetRegisterComponent;
  let fixture: ComponentFixture<TimesheetRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,    BrowserAnimationsModule,
        CommonViewModule,
        TimesheetRegisterModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ TimesheetRegisterComponent ],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return "client" when activeTab is "TAB_CLIENTS"', () => {
    component.activeTab = 'TAB_CLIENTS';
    const result = component.checkTab();
    expect(result).toBe('client');
  });

  it('should return "supplier" when activeTab is "TAB_SUPPLIERS"', () => {
    component.activeTab = 'TAB_SUPPLIERS';
    const result = component.checkTab();
    expect(result).toBe('supplier');
  });
  it('should return false if data is empty', () => {
    expect(component.isEmpty(null)).toBe(false);
    expect(component.isEmpty(undefined)).toBe(false);
    expect(component.isEmpty('')).toBe(false);
  });

  it('should return true if data is not empty', () => {
    expect(component.isEmpty('Hello')).toBe(true);
    expect(component.isEmpty(0)).toBe(true);
    expect(component.isEmpty([])).toBe(true);
    expect(component.isEmpty({})).toBe(true);
  });
});
