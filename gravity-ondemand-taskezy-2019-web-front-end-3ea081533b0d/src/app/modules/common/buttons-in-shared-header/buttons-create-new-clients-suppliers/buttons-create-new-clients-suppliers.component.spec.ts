import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonsCreateNewClientsSuppliersComponent } from './buttons-create-new-clients-suppliers.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";
describe('ButtonsCreateNewClientsSuppliersComponent', () => {
  let component: ButtonsCreateNewClientsSuppliersComponent;
  let fixture: ComponentFixture<ButtonsCreateNewClientsSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonsCreateNewClientsSuppliersComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsCreateNewClientsSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
