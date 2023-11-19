import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MatDialog } from '@angular/material/dialog';

import { SubAccountDetailsComponent } from './sub-account-details.component';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from '../../common-view.module';

describe('SubAccountDetailsComponent', () => {
  let component: SubAccountDetailsComponent;
  let fixture: ComponentFixture<SubAccountDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule, CommonViewModule],
      declarations: [SubAccountDetailsComponent],
      providers: [{ provide: MatDialog, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountDetailsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
