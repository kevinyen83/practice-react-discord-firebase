import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MatDialog } from "@angular/material/dialog";

import { SubscriptionTabComponent } from './subscription-tab.component';
import { SharedModule } from 'app/shared/shared.module';

describe('SubscriptionTabComponent', () => {
  let component: SubscriptionTabComponent;
  let fixture: ComponentFixture<SubscriptionTabComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubscriptionTabComponent
      ],
      imports: [
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
