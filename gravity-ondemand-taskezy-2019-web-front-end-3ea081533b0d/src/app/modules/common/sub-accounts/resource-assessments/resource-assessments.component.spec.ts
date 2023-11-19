import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { ResourceAssessmentsComponent } from './resource-assessments.component';

describe('ResourceAssessmentsComponent', () => {
  let component: ResourceAssessmentsComponent;
  let fixture: ComponentFixture<ResourceAssessmentsComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [ ResourceAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
