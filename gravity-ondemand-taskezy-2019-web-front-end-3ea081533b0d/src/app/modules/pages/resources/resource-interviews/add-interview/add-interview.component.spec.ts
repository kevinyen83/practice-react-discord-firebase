import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddInterviewComponent } from './add-interview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { StarRatingModule } from 'angular-star-rating';
// import { SignaturePadModule } from 'angular2-signaturepad';

import { ContinueInterviewComponent } from './continue-interview/continue-interview.component';
import { StarRatingControlComponent } from '../../../../common/star-rating-control/star-rating-control.component';
import { SignatureFieldComponent } from '../../../../common/signature-field/signature-field.component';

describe('AddInterviewComponent', () => {
  let component: AddInterviewComponent;
  let fixture: ComponentFixture<AddInterviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        // StarRatingModule,
        // SignaturePadModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ AddInterviewComponent, ContinueInterviewComponent, StarRatingControlComponent, SignatureFieldComponent ],
      providers: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterviewComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
