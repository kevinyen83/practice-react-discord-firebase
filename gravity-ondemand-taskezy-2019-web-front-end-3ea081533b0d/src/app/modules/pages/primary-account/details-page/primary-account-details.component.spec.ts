import { SharedModule } from 'app/shared/shared.module';
import { Intercom } from 'ng-intercom';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '../../../../fake-db/fake-db.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonViewModule } from '../../../common/common-view.module';
import { PrimaryAccountDetailsComponent } from "./primary-account-details.component";

describe('PrimaryAccountDetailsComponent', () => {
  let component: PrimaryAccountDetailsComponent;
  let fixture: ComponentFixture<PrimaryAccountDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        // Material
        MatSnackBarModule,
        MatDialogModule,

        SharedModule,    CommonViewModule,
        InMemoryWebApiModule.forRoot(FakeDbService, {
          delay             : 0,
          passThruUnknownUrl: true
        })
      ],
      providers: [
        {
          provide: Intercom,
          useValue: {}
        }
      ],
      declarations: [ PrimaryAccountDetailsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryAccountDetailsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
