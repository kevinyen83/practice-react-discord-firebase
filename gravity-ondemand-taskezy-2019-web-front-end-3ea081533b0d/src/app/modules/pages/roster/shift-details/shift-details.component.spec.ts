import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { forwardRef } from "@angular/core";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { ShiftDetailsComponent } from "./shift-details.component";
import { SharedModule } from 'app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ShiftDetailsComponent', () => {
  let component: ShiftDetailsComponent;
  let fixture: ComponentFixture<ShiftDetailsComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        SharedModule,    BrowserAnimationsModule
      ],
      declarations: [ ShiftDetailsComponent ],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ShiftDetailsComponent),  // replace name as appropriate
        multi: true
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
