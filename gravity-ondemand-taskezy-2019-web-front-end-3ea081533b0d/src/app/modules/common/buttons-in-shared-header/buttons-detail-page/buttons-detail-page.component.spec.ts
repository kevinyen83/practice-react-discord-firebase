import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsDetailPageComponent } from './buttons-detail-page.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('ButtonsDetailPageComponent', () => {
  let component: ButtonsDetailPageComponent;
  let fixture: ComponentFixture<ButtonsDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsDetailPageComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
