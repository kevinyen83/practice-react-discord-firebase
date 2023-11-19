import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

import { DetailsTabComponent } from './details-tab.component';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from 'app/modules/common/common-view.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailsTabComponent', () => {
  let component: DetailsTabComponent;
  let fixture: ComponentFixture<DetailsTabComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTabComponent ],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        CommonViewModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
