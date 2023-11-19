import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CreateAccountModalComponent } from './create-account-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SharedModule } from 'app/shared/shared.module';
import { PrimaryAccountModule } from '../primary-account.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Intercom } from 'ng-intercom';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

let AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('CreateAccountModalComponent', () => {
  let component: CreateAccountModalComponent;
  let fixture: ComponentFixture<CreateAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccountModalComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule,
        PrimaryAccountModule,
        RouterTestingModule
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: Intercom,
          useValue: {}
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
