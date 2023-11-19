import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonViewModule } from 'app/modules/common/common-view.module';
import { SharedModule } from 'app/shared/shared.module';

import { AddAccreditationModalComponent } from './add-accreditation-modal.component';

describe('AddAccreditationModalComponent', () => {
  let component: AddAccreditationModalComponent;
  let fixture: ComponentFixture<AddAccreditationModalComponent>;

  const dialogMock = {
    close: () => { }
  };

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,    BrowserAnimationsModule,
        HttpClientTestingModule,
        CommonViewModule
      ],
      declarations: [ AddAccreditationModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccreditationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check form', () => {
    component.buildForm();
    component.accreditationForm.patchValue({
      name: 'Licence',
      category: 'Security Licence',
      template: component.listAccreditations.length ? component.listAccreditations[0].id : '',
      timing: component.timings.length ? component.timings[0] : ''
    });
    if (component.accreditationForm.valid) {
      component.saveAccreditation();
    } else {
      component.toClose();
    }
  });
});
