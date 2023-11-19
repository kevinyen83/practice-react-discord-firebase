import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { catchError, tap } from "rxjs/operators";

import { SuppliersService } from "app/core/services/supplier/suppliers.service";
import { EMPTY } from 'rxjs';
import { ComplianceService } from "../../../../core/services/compliance/compliance.service";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  animations: fuseAnimations
})
export class AddRoleComponent implements OnInit {
  listAccreditations = [];
///// THIS ADD ROLE IS CALLED WHEN CREATING A ROLL FROM THE CREATE SHIFT
///// YOUR PROBABLY LOOKING FOR AddRoleWindowComponent in common
  constructor(private suppliersService: SuppliersService,
              private complianceService: ComplianceService) { }

  ngOnInit(): void {
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

}
