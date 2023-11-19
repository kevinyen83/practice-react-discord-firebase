import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { StarRatingModule } from 'angular-star-rating';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { SignaturePadModule } from 'angular2-signaturepad';

import { ResourceInterviewsComponent } from './resource-interviews.component';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { ContinueInterviewComponent } from './add-interview/continue-interview/continue-interview.component';
import { StarRatingControlComponent } from '../../../common/star-rating-control/star-rating-control.component';
import { SignatureFieldComponent } from '../../../common/signature-field/signature-field.component';

describe('ResourceInterviewsComponent', () => {
  let component: ResourceInterviewsComponent;
  let fixture: ComponentFixture<ResourceInterviewsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        // StarRatingModule,
        SharedModule
      ],
      declarations: [ ResourceInterviewsComponent, AddInterviewComponent, ContinueInterviewComponent, StarRatingControlComponent,
      SignatureFieldComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
