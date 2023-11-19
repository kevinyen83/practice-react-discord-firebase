import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateSupplierComponent } from './create-supplier.component';

import { DocumentsFormComponent } from '../../../../common/documents-form/documents-form.component';
import { DocumentsViewComponent } from '../../../../common/documents-view/documents-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CreateSupplierComponent', () => {
  let component: CreateSupplierComponent;
  let fixture: ComponentFixture<CreateSupplierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ CreateSupplierComponent,
        DocumentsFormComponent,
        DocumentsViewComponent ],
      providers: [ ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSupplierComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
