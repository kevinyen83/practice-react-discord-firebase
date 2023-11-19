import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { OpenDayEventsTemplateComponent } from './open-day-events-template.component';
import { SharedModule } from 'app/shared/shared.module';

describe('OpenDayEventsTemplateComponent', () => {
  let component: OpenDayEventsTemplateComponent;
  let fixture: ComponentFixture<OpenDayEventsTemplateComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ OpenDayEventsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDayEventsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
