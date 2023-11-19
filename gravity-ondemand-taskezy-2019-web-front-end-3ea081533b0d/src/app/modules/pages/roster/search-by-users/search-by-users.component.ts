import { Component, Inject, OnInit } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { AccountService } from 'app/core/services/account/account.service';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-search-by-users',
  templateUrl: './search-by-users.component.html'
})
export class SearchByUsersComponent implements OnInit {
  viewResources = true;
  // dataSource;
  resources = [];
  suppliers = [];
  role: any;
  number: any;
  defaultAvatar;
  shift: any;
  users = [];
  resourcesDisplayed = [];
  suppliersDisplayed = [];
  // clickedUser;
  // selectedUser: FormControl;
  selectedResources = [];
  selectedSuppliers = [];
  searchUsers: FormControl;
  supplierDisplayedColumns: MtxGridColumn[] = [
    { header: 'Supplier', field: 'supplierName', sortable: true },
    { header: 'Order Number', field: 'number', sortable: true }
  ];
  resourceDisplayedColumns: MtxGridColumn[] = [
    { header: 'Resource', field: 'resourceName', sortable: true },
    { header: 'Supplied By', field: 'suppliedBy', sortable: true },
    { header: 'Rating', field: 'resourceRating', sortable: true },
    { header: '', field: 'forExpand', showExpand: true }
  ];
  currentAccount;
  filteredResources = [];
  filteredSuppliers = [];

  unsubscribeAll = new Subject<any>();

  constructor(private avatarService: AvatarService,
              private dialogRef: MatDialogRef<SearchByUsersComponent>,
              private accountService: AccountService,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.searchUsers = new FormControl('');
  }

  ngOnInit(): void {
    this.shift = this.data?.shift;
    this.role = this.data?.role;
    this.number = this.data?.number;
    this.users = this.data?.users;
    this.resources = this.data?.users?.foundedUsers;
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.currentAccount = this.accountService.currentAccount.getValue();
    if (this.currentAccount && this.currentAccount?.uuid) {
      this.suppliers = [this.currentAccount, ...this.currentAccount?.suppliers];
      this.suppliers.forEach((supplier) => {
        supplier.number = 0;
      });
      this.suppliersDisplayed = this.suppliers.filter(s => this.users['ids'].includes(s.uuid));
      this.filteredSuppliers = [...this.suppliersDisplayed];
      this.resourcesDisplayed = this.resources?.filter(r => this.users['ids'].includes(r.resource.user_id) && r.resource.status === 1);
      this.filteredResources = [...this.resourcesDisplayed];
    }
  }

  selectResources(e) {
    this.selectedResources = e;
  }

  selectSuppliers(e) {
    this.selectedSuppliers = e;
  }

  changeSupplierNumber(index) {
    this.suppliersDisplayed.forEach((sup, i) => {
      if (i !== index) {
        sup.number = 0;
      }
    });
  }

  countSuppliers() {
    return this.suppliers.reduce((partSum, a) => partSum + a.number, 0);
  }

  select() {
    // return the list of resources or suppliers filterd by selected = true;
    // const selectedResources = this.resources.filter(res => res.selected);
    // const selectedSuppliers = this.suppliers.filter(sup => sup.selected);
    if (this.viewResources) {
      this.dialogRef.close({ selectedResources: this.selectedResources });
    } else {
      this.dialogRef.close({ selectedSuppliers: this.selectedSuppliers });
    }
  }

  onSearch() {
    this.resourcesDisplayed = this.onFilterResources();
    this.suppliersDisplayed = this.onFilterSuppliers();
  }

  toggleResources() {
    this.viewResources = !this.viewResources;
  }

  onFilterResources() {
    let searchText = this.searchUsers.value.toLowerCase();
    if (!searchText) {
      return this.filteredResources;
    } else {
      return this.filteredResources.filter(r => r?.resource?.name.toLowerCase().includes(searchText) || r?.supplier?.detail?.name.toLowerCase().includes(searchText));
    }
  }

  getRate(resource) {
    return resource?.assessment['avg'];
  }

  onFilterSuppliers() {
    let searchText = this.searchUsers.value.toLowerCase();
    if (!searchText) {
      return this.filteredSuppliers;
    } else {
      return this.filteredSuppliers.filter(r => r.detail.name.toLowerCase().includes(searchText));
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
