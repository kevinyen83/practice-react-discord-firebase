import { SharedModule } from 'app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MyProfileComponent } from './my-profile.component';
import { CommonViewModule } from '../../common/common-view.module';
import { Intercom } from 'ng-intercom';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

let AngularFireMocks = {
  storage: {
    app: {
      storage: jasmine.createSpy('storage')
    }
  },
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.storage.app.storage.and.returnValue(of({ doc: '123ABC' }));
AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, SharedModule, CommonViewModule],
      declarations: [MyProfileComponent, AvatarUploadComponent],
      providers: [
        {
          provide: Intercom,
          useValue: {}
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        },
        {
          provide: AngularFireStorage,
          useValue: AngularFireMocks
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
