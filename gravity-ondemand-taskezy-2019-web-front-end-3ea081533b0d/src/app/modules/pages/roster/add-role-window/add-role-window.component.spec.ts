import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { AddRoleWindowComponent } from './add-role-window.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('AddRoleWindowComponent', () => {
  let component: AddRoleWindowComponent;
  let fixture: ComponentFixture<AddRoleWindowComponent>;

    beforeEach(waitForAsync(() => {
     TestBed.configureTestingModule({
      declarations: [ AddRoleWindowComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        SharedModule,    BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
