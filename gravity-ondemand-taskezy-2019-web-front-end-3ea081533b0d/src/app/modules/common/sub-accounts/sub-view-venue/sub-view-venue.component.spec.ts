import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from 'app/shared/shared.module';
import { ListVenuesModule } from 'app/modules/pages/venues/list-venues/list-venues.module';
import { SubViewVenueComponent } from './sub-view-venue.component';

describe('SubViewVenueComponent', () => {
  let component: SubViewVenueComponent;
  let fixture: ComponentFixture<SubViewVenueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        ListVenuesModule
      ],
      declarations: [SubViewVenueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubViewVenueComponent);
    component = fixture.componentInstance;
    component.venue = {
      name: 'a venue',
      uuid: '1234-1234-1234-1234'
    };
    component.venueClient = {
      name: 'a client',
      uuid: '1234-1234-1234-1234'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
