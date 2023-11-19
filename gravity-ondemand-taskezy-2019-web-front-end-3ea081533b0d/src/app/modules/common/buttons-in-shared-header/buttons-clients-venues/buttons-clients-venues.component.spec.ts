import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsClientsVenuesComponent } from './buttons-clients-venues.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('ButtonsClientsVenuesComponent', () => {
  let component: ButtonsClientsVenuesComponent;
  let fixture: ComponentFixture<ButtonsClientsVenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsClientsVenuesComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsClientsVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
