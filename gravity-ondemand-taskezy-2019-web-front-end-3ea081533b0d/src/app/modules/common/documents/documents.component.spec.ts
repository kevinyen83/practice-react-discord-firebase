import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from '../common-view.module';

import { DocumentsComponent } from './documents.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        CommonViewModule
      ],
      declarations: [ DocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
