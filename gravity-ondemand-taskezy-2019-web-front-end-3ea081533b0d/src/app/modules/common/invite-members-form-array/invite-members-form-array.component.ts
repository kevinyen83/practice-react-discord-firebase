import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {concatMap, EMPTY, Subject } from 'rxjs';
import { from as observableFrom } from 'rxjs'

import { AccountService } from '../../../core/services/account/account.service';
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-invite-members-form-array',
  templateUrl: './invite-members-form-array.component.html'
})
export class InviteMembersFormArrayComponent implements OnInit, OnDestroy {
  addMembersForm: FormGroup;
  _currentAccount;
  invites: FormArray;
  roles = [
    { label: 'Resource', value: 0 },
    { label: 'Manager', value: 1 },
    { label: 'Assistant', value: 2 },
    { label: 'Administrator', value: 3 }
  ];
  @Input() set currentAccount(value) {
    if (value) {
      this._currentAccount = value;
    }
  }
  @Input() type;
  private unsubscribeAll = new Subject();

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  // checkForm() {
  // while (this.getControls().length !== 0) {
  //   (this.addMembersForm.get('invites') as FormArray).removeAt(0);
  // }
  // for(let i = 0; i < res; i++) {
  // (this.addMembersForm.get('invites') as FormArray).push(this.addInviteForm());
  // }
  // }

  getControls() {
    return (this.addMembersForm.get('invites') as FormArray).controls;
  }

  buildForm() {
    this.addMembersForm = this.formBuilder.group({
      invites: this.formBuilder.array([])
    });
  }

  addInviteForm() {
    return this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      email: this.formBuilder.control('', [
        Validators.email,
        Validators.required
      ]),
      role: this.formBuilder.control(0, Validators.required),
      department: this.formBuilder.control(''),
      sending: this.formBuilder.control(false),
      sent: this.formBuilder.control(false),
      error: this.formBuilder.control(false)
    });
  }

  addInvite() {
    this.invites = this.addMembersForm.get('invites') as FormArray;
    this.invites.push(this.addInviteForm());
  }

  checkAndAddInvite(e) {
    e.stopPropagation();
    e.preventDefault();
    const i = this.getControls().length;
    if (this.getControls()[i - 1].valid) {
      this.addInvite();
    }
  }

  sendInvites() {
    const invites = this.addMembersForm.get('invites').value;
    let arrayOfInvites = [];
    invites.map((invite, index) => {
      invite['ind'] = index;
      invite['control'] = this.getControls()[index];
      invite.control.get('sending').setValue(true);
      invite.control.get('error').setValue(false);
      if (invite.control.valid) {
        const formData = invite.control.value;

        let newInvite = {
          email: formData.email,
          name: formData.name,
          role: formData.role,
          message: `Hi, Come and join us at ${this._currentAccount.detail.name}`,
          department: formData.department
        };

        arrayOfInvites.push(newInvite);

        // const obs = this.accountService
        //   .inviteUserToAccount(this._currentAccount.uuid, invite.email, {
        //     name: formData.name,
        //     role: formData.role,
        //     message: `Hi, Come and join us at ${this._currentAccount.detail.name}`,
        //     department: formData.department
        //   })
        //   .pipe(
        //     tap((res) => {
        //       // this returns the full invite list
        //       invite.control.get('sending').setValue(false);
        //       invite.control.get('sent').setValue(true);
        //       invite.sent = true;

        //       /*
        //       account_name: "MCDONALD'S AUSTRALIA LIMITED"
        //       account_uuid: "d51f87d4-98f7-48c2-9d45-b1f5d1f923ee"
        //       date_invited: "2022-06-23T08:49:22.822Z"
        //       date_resolved: "0001-01-01T00:00:00Z"
        //       department: ""
        //       email: "email@email.com"
        //       role: 0
        //       sms: ""
        //       status: 0
        //       */
        //     }),
        //     catchError((err) => {
        //       invite.control.get('sending').setValue(false);
        //       invite.control.get('error').setValue(true);
        //       invite.error = true;
        //       if (err.status == 500) {
        //         if (err.error.includes('already invited')) {
        //           invite.control.get('email').setErrors({ exists: true });
        //         }
        //         // user may have been invited, but they are not being returned in the invitations for the account when getting full account.
        //       }
        //       return of(err);
        //     })
        //   );
        // obsArr.push(obs);
      } else {
        invite.control.get('sending').setValue(false);
        invite.control.get('error').setValue(true);
        invite.error = true;
      }
    });
    if (arrayOfInvites.length) {
      this.sendNewInvites(arrayOfInvites, invites);
    }
  }

  sendNewInvites(array, invites) {
    let currentEmail = '';
    observableFrom(array)
      .pipe(
        concatMap((el: any, index) => {
          currentEmail = el?.email;
          return this.accountService
            .inviteUserToAccount(this._currentAccount.uuid, el?.email, el).pipe(
              catchError(err => {
                let indx = invites.findIndex(invite => invite.control.get('email').value === currentEmail);
                invites[indx].control.get('sending').setValue(false);
                invites[indx].control.get('error').setValue(true);
                if (err.status == 208) {
                  if (err.error.text.includes('already a member') || err.error.text.includes('cannot invite yourself')) {
                    this.invites.controls.forEach((el, idx) => {
                      if (el.value.email === currentEmail) {
                        invites[indx].control.get('email').setErrors({ exists: true });
                      }
                    });
                  }
                  // user may have been invited, but they are not being returned in the invitations for the account when getting full account.
                }
                return EMPTY;
              })
            )
        })
      ).subscribe(
        response => {
                let indx = invites.findIndex(invite => invite.control.get('email').value === currentEmail);
                if (indx >= 0) {
                  invites[indx].control.get('sending').setValue(false);
                  this.removeInvite(indx);
                  invites = invites.filter(i => i.email !== currentEmail);
                  this.accountService.refreshCurrentAccount();
                }
            }
      );
  }

  removeInvite(i) {
    (this.addMembersForm.get('invites') as FormArray).removeAt(i);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    
  }
}
