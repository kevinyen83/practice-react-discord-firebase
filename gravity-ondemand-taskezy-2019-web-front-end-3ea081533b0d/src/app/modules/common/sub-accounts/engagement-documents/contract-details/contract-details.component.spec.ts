import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { ContractDetailsComponent } from './contract-details.component';
import { By } from '@angular/platform-browser';

describe('ContractDetailsComponent', () => {
  let component: ContractDetailsComponent;
  let fixture: ComponentFixture<ContractDetailsComponent>;


    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [ ContractDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDetailsComponent);
    component = fixture.componentInstance;
    component.venue = {
      name: 'a venue',
      uuid: '1234-1234-1234-1234'
    };
    component.venueClient = {
      name: 'a client',
      uuid: '1234-1234-1234-1234'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('datepicker text must start with day, not month', () => {
    if (navigator.language === 'en-AU') {
      component.editing = true;
      fixture.detectChanges();

      const datePicker = fixture.debugElement.query(By.css('.contract-review-date mat-datepicker-toggle button'));
      datePicker.nativeElement.click();
      fixture.detectChanges();

      const setDay = fixture.debugElement.queryAll(By.css('.mat-calendar-body-cell'));
      setDay[25].nativeElement.click(); // set day to 26
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('.contract-review-date input'));
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.nativeElement.value.startsWith('26')).toBe(true);
    }
  });
});
