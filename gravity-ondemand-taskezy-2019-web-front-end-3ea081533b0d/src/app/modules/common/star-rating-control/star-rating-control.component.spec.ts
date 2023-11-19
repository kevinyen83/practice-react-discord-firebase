import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from 'app/shared/shared.module';

// import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';

import { StarRatingControlComponent } from './star-rating-control.component';

describe('StarRatingControlComponent', () => {
  let component: StarRatingControlComponent;
  let fixture: ComponentFixture<StarRatingControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        // StarRatingModule,
        SharedModule
      ],
      declarations: [ StarRatingControlComponent ],
      // providers: [ StarRatingConfigService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarRatingControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
