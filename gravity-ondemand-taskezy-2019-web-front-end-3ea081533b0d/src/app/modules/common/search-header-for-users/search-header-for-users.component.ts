import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-search-header-for-users',
  templateUrl: './search-header-for-users.component.html'
})
export class SearchHeaderForUsersComponent implements OnInit {
  sorting: FormControl;
  select: FormControl;
  selects = [];
  currentFilter: string;
  sortingBy: string;

  @Input() currentUser;
  @Input() users;

  @Output() updateList = new EventEmitter<any>()

  constructor(private router: Router) {
    this.select = new FormControl("");
    this.sorting = new FormControl("");
  }

  ngOnInit(): void {
    // console.log("check current user: ", this.currentUser)
    // console.log("check user: ", this.users)
  }

  changeSorting(event) {
    this.currentFilter = event.value;
    if (event.value === 'Company Name') {
      this.sortingBy = 'name';
      let companies = [];
      if (this.currentUser === 'supplier' || this.currentUser === 'client') {
        this.users.forEach(cl => {
          companies = [...companies, {name: cl.detail.name, value: cl.detail.name}];
        });
      } else {
        this.users.forEach(cl => {
          companies = [...companies, {name: cl.name, value: cl.name}];
        });
      }
      this.selects = companies;
    }
    if (event.value === 'Status') {
      this.sortingBy = 'status';
      this.selects = [{name: 'Active', value: 1}, {name: 'Pending', value: 0}, {name: 'Inactive', value: 2}, {name: 'Waiting for Approval', value: 4}];
    }
  }

  changeInput(e){
    // console.log("this.currentFilter : ", this.currentFilter)
    this.updateList.emit({filter: this.currentFilter, value: e});
  }

  changeSelect(e) {
    const filterValue = this.select?.value;
    this.updateList.emit({filter: this.currentFilter, value: filterValue});
  }


  searchUser() {
    // let filteredUsers = []
    // if (this.select?.value) {
    //   if (this.currentFilter === 'Company Name') {
    //     filteredUsers = this.users.filter(cl => this.select?.value.includes(cl.name));
    //   }
    //   if (this.currentFilter === 'Status') {
    //     let statuses = this.statuses.filter(s => this.select?.value.includes(s.status));
    //     this.users.forEach(cl => statuses.map(s => {
    //       if (s.value === cl.status) {
    //         filteredUsers.push(cl);
    //       }
    //     }));
    //   }
    // }
    // if (!this.select?.value.length) {
    //   filteredUsers = this.users;
    // }
    // this.updateList.emit(filteredUsers);
  }
}
