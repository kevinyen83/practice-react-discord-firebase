import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

import { EditDocumentComponent } from './edit-document.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { SharedModule } from "../../../../shared/shared.module";
import { AddingDocumentsComponent } from "../adding-documents/adding-documents.component";
import { ChooseFilesComponent } from "../choose-files/choose-files.component";

describe('EditDocumentComponent', () => {
  let component: EditDocumentComponent;
  let fixture: ComponentFixture<EditDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditDocumentComponent,
        AddingDocumentsComponent,
        ChooseFilesComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
