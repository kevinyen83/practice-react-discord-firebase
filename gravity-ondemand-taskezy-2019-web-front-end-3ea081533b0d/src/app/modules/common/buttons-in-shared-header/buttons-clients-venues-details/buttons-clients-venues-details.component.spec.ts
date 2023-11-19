import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsClientsVenuesDetailsComponent } from './buttons-clients-venues-details.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('ButtonsClientsVenuesDetailsComponent', () => {
  let component: ButtonsClientsVenuesDetailsComponent;
  let fixture: ComponentFixture<ButtonsClientsVenuesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsClientsVenuesDetailsComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsClientsVenuesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
