import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { TimesheetTableUsersComponent } from './timesheet-table-users.component';
import { By } from "@angular/platform-browser";

describe('TimesheetTableUsersComponent', () => {
  let component: TimesheetTableUsersComponent;
  let fixture: ComponentFixture<TimesheetTableUsersComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [ TimesheetTableUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetTableUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check additional(split) time', () => {
    component._shifts.forEach(shift => {
      if (shift.tasks.length) {
        component.getResult('Additional field', shift.tasks[0]);
        let field = fixture.debugElement.query(By.css('.additional-field')).nativeElement;
        expect(field).toBeTruthy();
        component.additionalSubTotalControl.patchValue(5.00);
        component.additionalBreakControl.patchValue(1.30);
        expect(component.currentAdditional.textContent).toBe(3.70);
        component.getResult('Split time', shift.tasks[0]);
        let splitField = fixture.debugElement.query(By.css('.split')).nativeElement;
        expect(splitField).toBeTruthy();
        component.additionalSubTotal.patchValue(1.30);
        component.additionalBreakControl.patchValue(0.30);
        expect(component.currentSplit.textContent).toBe(1.00);
      }
    })
  });

  it('check changing of statuses', () => {
    component._shifts.forEach(shift => {
      if (shift.tasks.length) {
        shift.tasks.forEach(t => {
          let statusF = fixture.debugElement.query(By.css('.status-finalised')).nativeElement;
          expect(statusF).toBeTruthy();
          expect(statusF.textContent).toBe('Finalised');
          if (t.timesheet?.splits && t.timesheet?.splits.length) {
            component.editAdditionalTime(t.timesheet?.splits[0], 'split', t);
            let statusP = fixture.debugElement.query(By.css('.status-progress')).nativeElement;
            expect(statusP).toBeTruthy();
            expect(statusP.textContent).toBe('In Progress');
            component.cancelSplitTime(t.timesheet?.splits[0]);
            expect(statusF).toBeTruthy();
            expect(statusF.textContent).toBe('Finalised');
          }
        });
      }
    });
  });

  it('should convert 1.5 to 90', () => {
    const result = component['convertToMinutes'](1.5);
    expect(result).toBe(90);
  });

  it('should return false for numbers', () => {
    const result = component['isNaN'](0);
    expect(result).toBe(false)
  });

  describe('getSplitStatus', () => {
    it('should return "Finalised" when task is finalised', () => {
      const task = {
        editing: false,
        timesheet: { signon: { signature: 'signature' }, signoff: { signature: 'signature' } },
      };
      expect(component.getSplitStatus(task)).toBe('Finalised');
    });
  
    it('should return "Unworked" when task is unworked', () => {
      const task = {
        editing: false,
        resource: { release_status: 2 },
        timesheet: { signon: null },
      };
      expect(component.getSplitStatus(task)).toBe('Unworked');
    });
  
    it('should return "Unaccepted" when task is unaccepted', () => {
      const task = {
        editing: false,
        resource: { release_status: 1 },
      };
      expect(component.getSplitStatus(task)).toBe('Unaccepted');
    });
  });

  it('check the validatorGuard is working, initial value is -1, and should be true when it is initialised', () => {
    component.validatorGuard();
    expect(component.errorTotalSplit).toBeTrue();
  });

  it('should return "Unresolved" for 0 (Unresolved)', () => {
    const status = component.getStatus(0);
    expect(status).toBe('Unresolved');
  });

  it('should return "Non Billable" for Result.NonBillable', () => {
    const status = component.getStatus(2);
    expect(status).toBe('Non Billable');
  });

});

