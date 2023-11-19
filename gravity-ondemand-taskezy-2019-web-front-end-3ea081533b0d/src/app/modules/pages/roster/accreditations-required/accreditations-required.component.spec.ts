import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { AccreditationsRequiredComponent } from './accreditations-required.component';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from 'app/modules/common/common-view.module';

describe('AccreditationsRequiredComponent', () => {
  let component: AccreditationsRequiredComponent;
  let fixture: ComponentFixture<AccreditationsRequiredComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonViewModule,
        SharedModule
      ],
      declarations: [ AccreditationsRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditationsRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
