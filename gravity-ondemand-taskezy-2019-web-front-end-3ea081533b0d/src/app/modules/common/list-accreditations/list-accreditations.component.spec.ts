import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from 'app/shared/shared.module';

import { ListAccreditationsComponent } from './list-accreditations.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListAccreditationsComponent', () => {
  let component: ListAccreditationsComponent;
  let fixture: ComponentFixture<ListAccreditationsComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,    BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      declarations: [ ListAccreditationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccreditationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
