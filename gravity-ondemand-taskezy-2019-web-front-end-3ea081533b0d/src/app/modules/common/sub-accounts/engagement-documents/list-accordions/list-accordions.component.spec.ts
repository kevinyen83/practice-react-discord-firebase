import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MatDialog } from "@angular/material/dialog";

import { ListAccordionsComponent } from './list-accordions.component';
import { SharedModule } from 'app/shared/shared.module';

describe('ListAccordionsComponent', () => {
  let component: ListAccordionsComponent;
  let fixture: ComponentFixture<ListAccordionsComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ ListAccordionsComponent ],
      providers: [
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccordionsComponent);
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
