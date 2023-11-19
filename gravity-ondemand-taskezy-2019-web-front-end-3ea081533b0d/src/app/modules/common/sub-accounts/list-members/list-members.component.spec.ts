import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ListMembersComponent } from './list-members.component';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountService } from 'app/core/services/account/account.service';
import { BehaviorSubject, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {By} from "@angular/platform-browser";


const AngularFireMocks = {
  auth: jasmine.createSpy('auth')
};

AngularFireMocks.auth.and.returnValue(of({ uid: 'ABC123' }));

describe('ListMembersComponent', () => {
  let component: ListMembersComponent;
  let fixture: ComponentFixture<ListMembersComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule, HttpClientTestingModule, ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTableModule],
      declarations: [ListMembersComponent],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' },
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: AccountService,
          useValue: {
            currentAccount: new BehaviorSubject({
              uuid: '11',
              venues: [
                {
                  roles: []
                }
              ]
            }),
            selectedAccount: of({
              uuid: '22',
              members: [],
              invitation: {
                email: 'hi@hi.com'
              }
            }),
            getProfileSingle: (uuid) => {},
            getResourcesAndSuppliers: (uuid) => of([]),
            setPauseRefresh: (bool) => {}
          }
        },
        {
          provide: AngularFireAuth,
          useValue: AngularFireMocks
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check invite new administrator', () => {
    if (component.isExternallyManaged) {
      expect(By.css('.adding-member')).toBeFalsy();
    } else {
      expect(By.css('.adding-member')).toBeTruthy();
    }
  })
});
