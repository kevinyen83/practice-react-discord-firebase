import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ButtonsClientsDetailsComponent } from './buttons-clients-details.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";

describe('ButtonsClientsDetailsComponent', () => {
  let component: ButtonsClientsDetailsComponent;
  let fixture: ComponentFixture<ButtonsClientsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      declarations: [ ButtonsClientsDetailsComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' },
        SuppliersService,
        { provide: HttpClient, useClass: '' },
        { provide: ActivatedRoute, useValue: '' },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsClientsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isEditDetails should update editing to true and call changeView', () => {
    const headerButtonService = TestBed.inject(HeaderButtonService);
    spyOn(headerButtonService, 'changeView');
    component.isEditDetails();
    expect(component.editing).toBeTrue();
    expect(headerButtonService.changeView).toHaveBeenCalledWith('subAccount');
  });
});
