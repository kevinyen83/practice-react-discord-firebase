import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { catchError, EMPTY, switchMap } from 'rxjs';

import { MembersService } from 'app/core/services/members/members.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html'
})
export class EditMemberComponent implements OnInit {
  editMemberForm: FormGroup;
  currentAvatar;
  defaultAvatar;
  currId: string;
  members: any = [];

  constructor(private router: Router, private route: ActivatedRoute, private membersService: MembersService, private avatarService: AvatarService, private accountService: AccountService) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);
    
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.buildForm();
    this.route.params
      .pipe(
        switchMap((res) => {
          this.currId = res.id;
          return this.membersService._members;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.members = res;
          let currMember = this.members?.find((m) => m.uuid === this.currId);
          if (currMember.detail.avatar) {
            this.currentAvatar = currMember.detail.avatar;
          }
          this.buildEditForm(currMember);
        }
      });
  }

  backToListMembers() {
    this.router.navigate(['/pages/list-members']);
  }

  buildForm() {
    this.editMemberForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      role: new FormControl(''),
      department: new FormControl(''),
      address: new FormControl('')
    });
  }

  buildEditForm(member) {
    this.editMemberForm.patchValue({
      name: member?.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member?.department,
      address: member?.address
    });
  }

  uploadAvatar(file) {
    this.getBase64(file.files[0]).then((avatar) => {
      this.currentAvatar = avatar;
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  saveMember() {
    let member = {
      uuid: this.currId,
      detail: {
        avatar: this.currentAvatar
      }
    };
    for (let control in this.editMemberForm.controls) {
      member[control] = this.editMemberForm.controls[control].value;
    }
    this.members = this.members.filter((mem) => mem.uuid !== this.currId);
    this.members = [
      ...this.members,
      member
    ];
    this.membersService.members = this.members;
    this.backToListMembers();
  }

  ngOnDestroy(): void {
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
