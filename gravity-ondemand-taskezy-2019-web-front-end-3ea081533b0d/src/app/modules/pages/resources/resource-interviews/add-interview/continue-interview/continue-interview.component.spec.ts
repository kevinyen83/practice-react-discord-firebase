import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';

import { ContinueInterviewComponent } from './continue-interview.component';
import { StarRatingControlComponent } from '../../../../../common/star-rating-control/star-rating-control.component';

describe('ContinueInterviewComponent', () => {
  let component: ContinueInterviewComponent;
  let fixture: ComponentFixture<ContinueInterviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        // StarRatingModule,
        SharedModule
      ],
      declarations: [ ContinueInterviewComponent, StarRatingControlComponent ],
      // providers: [ StarRatingConfigService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
