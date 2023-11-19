import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SubAccountFormComponent } from './sub-account-form.component';
import { DocumentsFormComponent } from '../../documents-form/documents-form.component';
import { DocumentsViewComponent } from '../../documents-view/documents-view.component';
import { DetailsFormComponent } from '../details-form/details-form.component';
import { By } from "@angular/platform-browser";

describe('SubAccountFormComponent', () => {
  let component: SubAccountFormComponent;
  let fixture: ComponentFixture<SubAccountFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ SubAccountFormComponent, DetailsFormComponent,
        DocumentsFormComponent, DocumentsViewComponent ],
      providers: [ ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountFormComponent);
    component = fixture.componentInstance;
    component.buildFormAbn();
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check exist abn', () => {
    if (component.abnForm.get('abn').value) {
      expect(component.abnForm.valid).toBeTruthy();
      component.searchAbn();
      let info = fixture.debugElement.query(By.css('.adding-profile')).nativeElement;
      expect(info).toBeTruthy();
      component.backToAbn();
      let value = '61989306306';
      component.abnForm.get('abn').patchValue(value);
      component.searchAbn();
      expect(info).toBeTruthy();
      let button = fixture.debugElement.query(By.css('.button-confirm')).nativeElement;
      expect(button.textContent).toBe('Request a connection');
      component.confirmAbn();
    }
  });
});
