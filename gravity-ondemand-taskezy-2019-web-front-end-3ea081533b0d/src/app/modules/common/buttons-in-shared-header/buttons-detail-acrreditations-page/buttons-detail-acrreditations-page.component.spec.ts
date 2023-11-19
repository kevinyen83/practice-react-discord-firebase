import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsDetailAcrreditationsPageComponent } from './buttons-detail-acrreditations-page.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('ButtonsDetailAcrreditationsPageComponent', () => {
  let component: ButtonsDetailAcrreditationsPageComponent;
  let fixture: ComponentFixture<ButtonsDetailAcrreditationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsDetailAcrreditationsPageComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsDetailAcrreditationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
