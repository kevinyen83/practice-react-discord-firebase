import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { AvatarService } from "app/core/services/avatar/avatar.service";
import { v4 as uuidv4 } from "uuid";

const FORM_METHOD_SEARCH = "FORM_METHOD_SEARCH";
const FORM_METHOD_UPDATE = "FORM_METHOD_UPDATE";
const FORM_METHOD_NEW = "FORM_METHOD_NEW";

@Component({
  selector: "app-adding-resources",
  templateUrl: "./adding-resources.component.html",
  animations: fuseAnimations
})
export class AddingResourcesComponent implements OnInit {
  addResourceForm: FormGroup;
  inviteResourceForm: FormGroup;
  viewInviteForm: boolean = true;

  @Output() addResource = new EventEmitter<any>();
  @Output() cancelResource = new EventEmitter<any>();

  defaultAvatar;

  constructor(private avatarService: AvatarService) {
    this.defaultAvatar = this.avatarService.defaultAvatar;
  }

  ngOnInit(): void {   
    this.buildInviteForm();
    this.buildAddResourceForm();
  }

  buildAddResourceForm() {
    this.addResourceForm = new FormGroup({
      name: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
      type: new FormControl(""),
    });
  }

  buildInviteForm() {
    this.inviteResourceForm = new FormGroup({
      emailIdentificator: new FormControl(''),
      mobileNumber: new FormControl('')
    })
  }

  backToList() {
    this.cancelResource.emit();
  }

  searchResource() {
    this.viewInviteForm = false;
    this.fillEmailandPhone(this.inviteResourceForm.get('emailIdentificator').value, this.inviteResourceForm.get('mobileNumber').value)
  }

  fillEmailandPhone(email, phone) {
    this.addResourceForm.get('email').patchValue(email);
    this.addResourceForm.get('phone').patchValue(phone);
  }

  backToResource() {
    this.cancelResource.emit();
  }

  inviteResource() {
    let resource = {
      id: uuidv4(),
      detail: {
        name: this.addResourceForm.get("name").value,
        emails: [
          { number: this.addResourceForm.get("email").value }
        ],
        phone_numbers: [
          { number: this.addResourceForm.get("phone").value }
        ]
      },
      type: this.addResourceForm.get("type").value,
    };
    this.addResource.emit(resource);
  }
}
