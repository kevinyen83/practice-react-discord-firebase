import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { TaskChecklistComponent } from './task-checklist.component';

describe('TaskChecklistComponent', () => {
  let component: TaskChecklistComponent;
  let fixture: ComponentFixture<TaskChecklistComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule, BrowserAnimationsModule],
      declarations: [ TaskChecklistComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
