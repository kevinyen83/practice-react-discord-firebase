import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Intercom } from 'ng-intercom';
import { MatDialog } from '@angular/material/dialog';

import { VerifyingNowComponent } from './verifying-now.component';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('VerifyingNowComponent', () => {
  let component: VerifyingNowComponent;
  let fixture: ComponentFixture<VerifyingNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [VerifyingNowComponent],
      providers: [
        FuseConfirmationService,
        {
          provide: Intercom,
          useValue: {}
        },
        { provide: MatDialog, useValue: {} },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyingNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
