import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { NgxStripeModule, StripeService } from "ngx-stripe";

import { AddPaymentPlaneComponent } from './add-payment-plane.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NGX_STRIPE_VERSION } from 'ngx-stripe/lib/interfaces/ngx-stripe.interface';

describe('AddPaymentPlaneComponent', () => {
  let component: AddPaymentPlaneComponent;
  let fixture: ComponentFixture<AddPaymentPlaneComponent>;

    beforeEach(waitForAsync(() => {
    (window as any).Stripe = function () {
      // your mock here
      return {
        elements: () => ({
          create: () => ({
            mount: () => ({ /* your card */ })
          })
        })
      }
    }

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxStripeModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [ 
        {
          provide: StripeService,
          useValue: {},
        }
        // ,
        // {
        //   provide: NGX_STRIPE_VERSION,
        //   useClass: '',
        // }
      ],
      declarations: [ AddPaymentPlaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
