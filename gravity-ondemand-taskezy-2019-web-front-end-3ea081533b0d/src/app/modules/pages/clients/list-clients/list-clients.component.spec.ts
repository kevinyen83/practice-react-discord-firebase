import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { ListClientsComponent } from './list-clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { FakeDbService } from '../../../../fake-db/fake-db.service';
import { DocumentsFormComponent } from '../../../common/documents-form/documents-form.component';
import { DocumentsViewComponent } from '../../../common/documents-view/documents-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExcelService } from '../../roster/excel.service';

describe('ListClientsComponent', () => {
  let component: ListClientsComponent;
  let fixture: ComponentFixture<ListClientsComponent>;

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
        SharedModule

      ],
      declarations: [
        ListClientsComponent,
        CreateClientComponent,
        DocumentsFormComponent,
        DocumentsFormComponent,
        DocumentsViewComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ExcelService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
