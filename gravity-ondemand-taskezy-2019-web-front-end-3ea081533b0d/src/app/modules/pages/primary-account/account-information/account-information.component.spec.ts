import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountInformationComponent } from './account-information.component';
import { SharedModule } from 'app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Intercom } from 'ng-intercom';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

let AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AccountInformationComponent],
      providers: [
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
