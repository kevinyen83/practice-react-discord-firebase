import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonViewModule } from 'app/modules/common/common-view.module';
import { SharedModule } from 'app/shared/shared.module';
import { Intercom } from 'ng-intercom';
import { of } from 'rxjs';

import { PrimaryAccountComponent } from './primary-account.component';
import { PrimaryAccountModule } from './primary-account.module';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('PrimaryAccountComponent', () => {
  let component: PrimaryAccountComponent;
  let fixture: ComponentFixture<PrimaryAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        CommonViewModule,
        PrimaryAccountModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ],

      declarations: [PrimaryAccountComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
