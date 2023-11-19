import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FiltersIncidentsComponent } from './filters-incidents.component';
import { SharedModule } from 'app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FiltersIncidentsComponent', () => {
  let component: FiltersIncidentsComponent;
  let fixture: ComponentFixture<FiltersIncidentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [ FiltersIncidentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersIncidentsComponent);
    component = fixture.componentInstance;
    component.shifts = [];
    component.suppliers = [];
    component.resources = [];
    component.clients = [];
    spyOn(component.closeSideBar, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
