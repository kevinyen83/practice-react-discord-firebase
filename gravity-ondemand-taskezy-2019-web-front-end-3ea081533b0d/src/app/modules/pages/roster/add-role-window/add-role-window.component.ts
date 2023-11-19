import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { fuseAnimations } from '@fuse/animations';

import { catchError, tap } from "rxjs/operators";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { AddAccreditationToRoleComponent } from "../../../common/add-accreditation-to-role/add-accreditation-to-role.component";

import { EMPTY } from 'rxjs';
import { ComplianceService } from "../../../../core/services/compliance/compliance.service";


@Component({
  selector: 'app-add-role-window',
  templateUrl: './add-role-window.component.html',
  animations: fuseAnimations
})
export class AddRoleWindowComponent implements OnInit {
  addRoleForm: FormGroup;
  listAccreditations = [];
  selectedLicence = [];

  constructor(private matDialogRef: MatDialogRef<any>,
              private dialog: MatDialog,
              private complianceService: ComplianceService) { }

  ngOnInit(): void {
    this.buildForm();
    this.complianceService.checkAccreditation().pipe(
      tap(res => {
        this.listAccreditations = res;
      }),
      catchError((err) => {
        console.log(err);
        return EMPTY;
      })
    ).subscribe();
  }

  close() {
    this.matDialogRef.close();
  }

  changeChecked(event, name) {
    if (!event.checked) {
      this.selectedLicence.map(l => {
        return l.names = l.names.filter(n => n !== name);
      });
    }
  }

  saveRole() {
    let item = {};
    for(let control in this.addRoleForm.controls) {
      item[control] = this.addRoleForm.get(control).value
    }
    this.matDialogRef.close(item);
  }

  buildForm() {
    this.addRoleForm = new FormGroup({
      role: new FormControl(''),
      accreditation: new FormControl(''),
      rateType: new FormControl(''),
      itemCode: new FormControl(''),
      description: new FormControl(''),
      rate: new FormControl(''),
    })
  }

  toAccreditations() {
    const dialogRef = this.dialog.open(AddAccreditationToRoleComponent, {
      width: '1115px',
      data: {
        list: this.listAccreditations
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.selectedLicence = res;
    })
  }

}
