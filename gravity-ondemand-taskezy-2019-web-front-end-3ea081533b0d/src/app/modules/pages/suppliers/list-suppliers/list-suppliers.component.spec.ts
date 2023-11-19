import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { ListSuppliersComponent } from './list-suppliers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FakeDbService } from '../../../../fake-db/fake-db.service';
import { HttpClientInMemoryWebApiModule, InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ExcelService } from '../../roster/excel.service';
import { CommonViewModule } from 'app/modules/common/common-view.module';
import { DocumentsFormComponent } from '../../../common/documents-form/documents-form.component';
import { DocumentsViewComponent } from '../../../common/documents-view/documents-view.component';
import { SubAccountFormComponent } from '../../../common/sub-accounts/sub-account-form/sub-account-form.component';

describe('ListSuppliersComponent', () => {
  let component: ListSuppliersComponent;
  let fixture: ComponentFixture<ListSuppliersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        InMemoryWebApiModule.forRoot(FakeDbService, {
          delay: 0,
          passThruUnknownUrl: true
        }),
        HttpClientInMemoryWebApiModule,
        SharedModule,
        CommonViewModule

      ],
      declarations: [
        ListSuppliersComponent,
        CreateSupplierComponent,
        SubAccountFormComponent,
        DocumentsFormComponent,
        DocumentsFormComponent,
        DocumentsViewComponent
      ],
      providers: [
        ExcelService,
        { provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
