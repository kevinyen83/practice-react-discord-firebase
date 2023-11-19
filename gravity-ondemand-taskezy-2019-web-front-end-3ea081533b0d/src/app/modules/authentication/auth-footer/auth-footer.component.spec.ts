import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthFooterComponent } from './auth-footer.component';
import { Intercom } from 'ng-intercom';
import { MatDialogConfig } from '@angular/material/dialog';
import { TermsConditionsComponent } from 'app/modules/common/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from 'app/modules/common/privacy-policy/privacy-policy.component';
import { SharedModule } from 'app/shared/shared.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('AuthFooterComponent', () => {
  let component: AuthFooterComponent;
  let fixture: ComponentFixture<AuthFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [AuthFooterComponent],
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
    fixture = TestBed.createComponent(AuthFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open dialog terms', () => {
    const openDialogSpy = spyOn(component.dialog, 'open');
    const fakeDialogConfig = new MatDialogConfig();
    fakeDialogConfig.width = '65%';
    fakeDialogConfig.maxHeight = '90vh';

    component.openModal('terms_conditions');

    expect(openDialogSpy).toHaveBeenCalledWith(TermsConditionsComponent, fakeDialogConfig);
  });

  it('open dialog privacy', () => {
    const openDialogSpy = spyOn(component.dialog, 'open');
    const fakeDialogConfig = new MatDialogConfig();
    fakeDialogConfig.width = '65%';
    fakeDialogConfig.maxHeight = '90vh';

    component.openModal('privacy_policy');

    expect(openDialogSpy).toHaveBeenCalledWith(PrivacyPolicyComponent, fakeDialogConfig);
  });
});
