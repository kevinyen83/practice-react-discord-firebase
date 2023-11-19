import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WelcomeComponent } from './welcome.component';
import { Intercom } from 'ng-intercom';
import { FUSE_APP_CONFIG } from '../../../../@fuse/services/config/config.constants';
import { SharedModule } from 'app/shared/shared.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      declarations: [WelcomeComponent],
      providers: [
        { provide: FUSE_APP_CONFIG, useValue: {} },
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
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
