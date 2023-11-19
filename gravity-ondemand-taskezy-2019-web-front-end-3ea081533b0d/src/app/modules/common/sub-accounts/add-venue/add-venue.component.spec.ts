import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AddVenueComponent } from './add-venue.component';
import { SharedModule } from 'app/shared/shared.module';
import { By } from "@angular/platform-browser";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe('AddVenueComponent', () => {
  let component: AddVenueComponent;
  let fixture: ComponentFixture<AddVenueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVenueComponent ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVenueComponent);
    component = fixture.componentInstance;
    component.venueForm = new FormGroup({
      client: new FormControl({}, Validators.required),
      venueName: new FormControl('', Validators.required),
      typeOfVenue: new FormControl('Private', Validators.required),
      stations: new FormControl([]),
      address: new FormControl('', Validators.required),
      licenceNumber: new FormControl(''),
      licenceName: new FormControl(''),
      signOnDistance: new FormControl(100, Validators.pattern('[0-9]*'))
    });
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check add venue', () => {
    component.venueForm.get('venueName').setValue('new Venue');

    component.venueForm.get('address').setValue('15 Debenham St, Mawson, ACT');

    component.venueForm.get('stations').setValue(['Side Entrance']);

    component.venueForm.get('signOnDistance').setValue('value');

    expect(component.venueForm.get('signOnDistance').valid).toBeFalsy();

    component.venueForm.get('signOnDistance').setValue('20');

    expect(component.venueForm.get('signOnDistance').valid).toBeTrue();

    component.save();
  });
});
