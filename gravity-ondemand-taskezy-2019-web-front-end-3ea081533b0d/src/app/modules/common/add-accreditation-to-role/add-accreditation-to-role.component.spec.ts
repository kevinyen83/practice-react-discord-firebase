import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";

import { AddAccreditationToRoleComponent } from './add-accreditation-to-role.component';
import { ListAccreditationsComponent } from "../list-accreditations/list-accreditations.component";
import { AccreditationsContentComponent } from "../accreditations-content/accreditations-content.component";
import { FuseConfirmationService } from "../../../../@fuse/services/confirmation";

describe('AddAccreditationToRoleComponent', () => {
  let component: AddAccreditationToRoleComponent;
  let fixture: ComponentFixture<AddAccreditationToRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccreditationToRoleComponent, AccreditationsContentComponent, ListAccreditationsComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatExpansionModule,
        MatIconModule,
        MatDialogModule
      ],
      providers: [
        FuseConfirmationService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccreditationToRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
