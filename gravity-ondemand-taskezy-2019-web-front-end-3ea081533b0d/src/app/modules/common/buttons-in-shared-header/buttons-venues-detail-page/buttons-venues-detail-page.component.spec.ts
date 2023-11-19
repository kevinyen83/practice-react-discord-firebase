import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsVenuesDetailPageComponent } from './buttons-venues-detail-page.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('ButtonsVenuesDetailPageComponent', () => {
  let component: ButtonsVenuesDetailPageComponent;
  let fixture: ComponentFixture<ButtonsVenuesDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsVenuesDetailPageComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsVenuesDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
