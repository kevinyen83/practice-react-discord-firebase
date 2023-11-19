import { SharedModule } from './../../../../shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReleaseRosterComponent } from './release-roster.component';

import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ReleaseRosterComponent', () => {
  let component: ReleaseRosterComponent;
  let fixture: ComponentFixture<ReleaseRosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
          HttpClientTestingModule,
          SharedModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      declarations: [ ReleaseRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseRosterComponent);
    component = fixture.componentInstance;
    component.dateOfReleaseRoster = new Date();
    // const date = moment();
    // const start = moment().startOf('week');
    // component.dateOfReleaseRoster = [
    //   {today: date.isoWeekday() === start.isoWeekday(), mDate: start},
    //   {today: date.isoWeekday() === start.add(1, 'd').isoWeekday(), mDate: start.add(1, 'd')},
    //   {today: date.isoWeekday() === start.add(1, 'd').isoWeekday(), mDate: start.add(1, 'd')},
    //   {today: date.isoWeekday() === start.add(1, 'd').isoWeekday(), mDate: start.add(1, 'd')},
    //   {today: date.isoWeekday() === start.add(1, 'd').isoWeekday(), mDate: start.add(1, 'd')},
    //   {today: date.isoWeekday() === start.add(1, 'd').isoWeekday(), mDate: start.add(1, 'd')},
    //   {today: date.isoWeekday() === start.add(1, 'd').isoWeekday(), mDate: start.add(1, 'd')}
    // ];
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
