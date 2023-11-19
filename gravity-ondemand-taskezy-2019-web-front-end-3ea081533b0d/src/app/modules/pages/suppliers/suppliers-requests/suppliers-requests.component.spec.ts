import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuppliersRequestsComponent } from './suppliers-requests.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FoundSupplierComponent } from './found-supplier/found-supplier.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeDbService } from '../../../../fake-db/fake-db.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

describe('SuppliersRequestsComponent', () => {
  let component: SuppliersRequestsComponent;
  let fixture: ComponentFixture<SuppliersRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        InMemoryWebApiModule.forRoot(FakeDbService, {
          delay: 0,
          passThruUnknownUrl: true
        }),
        SharedModule

      ],
      declarations: [
        SuppliersRequestsComponent,
        FoundSupplierComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
