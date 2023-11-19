import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { TaskChecklistComponent } from '../../pages/venues/task-checklist/task-checklist.component';
import { AddShiftRoleWindowComponent } from '../add-shift-role-window/add-shift-role-window.component';
import { AccountService } from '../../../core/services/account/account.service';

export interface PeriodicElement {
  role: string;
  accreditation: string;
  accreditationType: {
    name: string;
    type: string;
    induction: string;
  };
  chargeRate: string;
  itemCode: string;
  description: string;
  rate: string;
}

@Component({
  selector: 'app-resource-roles',
  templateUrl: './resource-roles.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))])

  ]
})
export class ResourceRolesComponent implements OnInit, OnChanges {
  resourcesRequirements = [];
  defaultAvatar;
  dataSource: MatTableDataSource<any>;
  expandedElement: PeriodicElement | null;
  dataSourceResourceRequirements: MatTableDataSource<any>;
  columnsToDisplay = [
    'Shift Role',
    'Accreditation',
    'Rate type',
    'Rate',
    'Item code',
    'Description',
    'more'
  ];
  @Input() venue;
  @Input() venueClient;
  @Input() currentAccount;

  constructor(private dialog: MatDialog, private accountService: AccountService) {}

  ngOnInit(): void {
    if (this.venue && this.venue.roles) {
      this.dataSource = new MatTableDataSource(this.venue.roles);
    } else {
      this.accountService.getShiftRoles();
      this.accountService.shiftRoles
        .pipe(
          tap((res: any[]) => {
            this.dataSource = new MatTableDataSource(res);
          })
        )
        .subscribe();
    }
  }

  ngOnChanges() {
    if (this.venue && this.venue.roles) {
      this.dataSource = new MatTableDataSource(this.venue.roles);
    }
  }

  addTaskChecklist() {
    const dialogRef = this.dialog.open(TaskChecklistComponent, {
      width: '521px',
      position: {
        top: '0px',
        right: '0px'
      },
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  createShiftRole() {
    const dialogRef = this.dialog.open(AddShiftRoleWindowComponent, {
      width: '800px',
      data: {
        venue: this.venue,
        shiftRoles: this.dataSource?.filteredData,
        venueClient: this.venueClient,
        currentAccount: this.currentAccount
      }
    });
  }

  editRole(role) {
    const dialogRef = this.dialog.open(AddShiftRoleWindowComponent, {
      width: '800px',
      data: {
        venue: this.venue,
        shiftRoles: this.dataSource.filteredData,
        currentRole: role,
        venueClient: this.venueClient,
        currentAccount: this.currentAccount
      }
    });
  }

  getCurrentRate(id, status) {
    if (this.venue?.resource_rates && id) {
      let rate = this.venue?.resource_rates.find((r) => r.uuid === id);
      if (rate && rate?.rates) {
        let names = [];
        rate?.rates.forEach((r) => {
          if (status === 'type') {
            names.push(r.name);
          }
          if (status === 'rate') {
            names.push(r.value);
          }
          if (status === 'code') {
            names.push(r.item_code);
          }
        });
        return names;
      }
    }
  }
}
