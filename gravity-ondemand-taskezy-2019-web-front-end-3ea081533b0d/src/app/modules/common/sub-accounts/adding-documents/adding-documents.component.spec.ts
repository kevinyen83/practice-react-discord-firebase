import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from '../../common-view.module';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { AddingDocumentsComponent } from './adding-documents.component';

describe('AddingDocumentsComponent', () => {
  let component: AddingDocumentsComponent;
  let fixture: ComponentFixture<AddingDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
        CommonViewModule,
        HttpClientTestingModule
      ],
      declarations: [AddingDocumentsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
