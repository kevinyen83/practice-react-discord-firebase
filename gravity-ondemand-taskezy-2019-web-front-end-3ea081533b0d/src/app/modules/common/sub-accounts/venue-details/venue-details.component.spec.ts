import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { MatDialog } from "@angular/material/dialog";

import { VenueDetailsComponent } from './venue-details.component';
import { FuseConfirmationService } from "../../../../../@fuse/services/confirmation";

describe('VenueDetailsComponent', () => {
  let component: VenueDetailsComponent;
  let fixture: ComponentFixture<VenueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ VenueDetailsComponent ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.venueClient = {
      name: 'a client',
      uuid: '1234-1234-1234-1234'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
