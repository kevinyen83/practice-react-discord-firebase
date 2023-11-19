import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  animations: fuseAnimations
})
export class AddResourceComponent implements OnInit {
  resourceForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddResourceComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.buildForm();
    if (this.data) {
      this.buildEditForm(this.data);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    const resource = {
      name: this.resourceForm.get('name').value,
      email: this.resourceForm.get('email').value,
      licence: this.resourceForm.get('licenceNumber').value,
    };
    this.dialogRef.close(resource);
  }

  buildEditForm(resource) {
    this.resourceForm.get('name').patchValue(resource.name);
    this.resourceForm.get('email').patchValue(resource.email);
    this.resourceForm.get('licenceNumber').patchValue(resource.licence);
  }

  buildForm() {
    this.resourceForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      licenceNumber: new FormControl('', Validators.required)
    });
  }

}
