import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FiltersRosterComponent } from './filters-roster.component';
import { SharedModule } from 'app/shared/shared.module';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FiltersRosterComponent', () => {
  let component: FiltersRosterComponent;
  let fixture: ComponentFixture<FiltersRosterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,    BrowserAnimationsModule
      ],
      declarations: [ FiltersRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersRosterComponent);
    component = fixture.componentInstance;
    component.suppliers = [];
    component.resources = [];
    component.clients = [];
    spyOn(component.changeFilter, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
