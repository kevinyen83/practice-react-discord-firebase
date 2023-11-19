import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FoundSupplierForResourceComponent } from './found-supplier-for-resource.component';
import { SharedModule } from 'app/shared/shared.module';

describe('FoundSupplierForResourceComponent', () => {
  let component: FoundSupplierForResourceComponent;
  let fixture: ComponentFixture<FoundSupplierForResourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundSupplierForResourceComponent ],
      imports: [ HttpClientTestingModule,
      SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundSupplierForResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
