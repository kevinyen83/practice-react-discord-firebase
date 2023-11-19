import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EditProfileComponent } from './edit-profile.component';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  const data = {
    firstName: '',
    lastName: '',
    mobilePhone: '',
    email: '',
    data: {
      address: ''
    }
  };

  beforeEach(async () => {
    const matDialogSpy = jasmine.createSpyObj('MatDialogRef', [
      'onNoClick',
      'closeDialog'
    ]);

    await TestBed.configureTestingModule({
      declarations: [EditProfileComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        NgxMatIntlTelInputModule
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: MatDialogRef,
          useValue: matDialogSpy
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
