import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatDialog } from "@angular/material/dialog";

import { AddAccreditationComponent } from './add-accreditation.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { SharedModule } from "../../../../shared/shared.module";
import { CommonViewModule } from "../../common-view.module";
import {By} from "@angular/platform-browser";

describe('AddAccreditationComponent', () => {
  let component: AddAccreditationComponent;
  let fixture: ComponentFixture<AddAccreditationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccreditationComponent ],
      imports: [
        SharedModule,
        CommonViewModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: {}},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccreditationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check accreditations field', () => {
    component.categoryList = ['Examples of Fields', 'Security Licence', 'Other']
    component.addAccreditationForm.get('category').setValue(component.categoryList[0]);
    component.handleChangeCategory();
    expect(component.addAccreditationForm.get('accreditation')).toBeTruthy();
    component.accreditationList = ['Example Accreditation'];
    component.addAccreditationForm.get('accreditation').patchValue(component.accreditationList[0]);
    component.handleChangeAccreditation();
    fixture.detectChanges();
  })
});
