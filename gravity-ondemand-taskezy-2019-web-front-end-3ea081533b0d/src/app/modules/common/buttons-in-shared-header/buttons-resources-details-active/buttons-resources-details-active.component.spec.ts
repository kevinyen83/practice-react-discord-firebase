import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsResourcesDetailsActiveComponent } from './buttons-resources-details-active.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('ButtonsResourcesDetailsActiveComponent', () => {
  let component: ButtonsResourcesDetailsActiveComponent;
  let fixture: ComponentFixture<ButtonsResourcesDetailsActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsResourcesDetailsActiveComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsResourcesDetailsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
