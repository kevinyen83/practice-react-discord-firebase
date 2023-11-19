import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { FiltersOfRosterHeaderComponent } from './filters-of-roster-header.component';

describe('FiltersOfRosterHeaderComponent', () => {
  let component: FiltersOfRosterHeaderComponent;
  let fixture: ComponentFixture<FiltersOfRosterHeaderComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [ FiltersOfRosterHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersOfRosterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
