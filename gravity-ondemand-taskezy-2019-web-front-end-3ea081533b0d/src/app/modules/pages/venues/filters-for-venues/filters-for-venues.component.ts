import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { fuseAnimations } from '@fuse/animations';
import { Router } from "@angular/router";

@Component({
  selector: 'app-filters-for-venues',
  templateUrl: './filters-for-venues.component.html',
  animations: fuseAnimations
})
export class FiltersForVenuesComponent implements OnInit {

  filtersForm: FormGroup;
  selects = [];
  currentFilter;
  @Input() users;
  @Output() updateList = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.formBuild();
  }

  searchVenue() {

  }

  changeSorting(event) {
    this.currentFilter = event.value;
    if (event.value === 'Venue name') {
      let companies = [];
      this.users.forEach(venue => {
        if (!companies.includes(venue.venue.name)) {
          companies = [...companies, venue.venue.name];
        }
      });
      this.selects = companies;
    }
    if (event.value === 'Venue type') {
      let types = [];
      this.users.forEach(venue => {
        if (!types.includes(venue.venue.type)) {
          types = [...types, venue.venue.type];
        }
      });
      this.selects = types;
    }
    if (event.value === 'Client') {
      let clients = [];
      this.users.forEach(venue => {
        if (!clients.includes(venue.client.name)) {
          clients = [...clients, venue.client.name];
        }
      });
      this.selects = clients;
    }
  }

  changeSelect(e) {
    const filterValue = this.filtersForm.get('select').value;
    this.updateList.emit({filter: this.currentFilter, value: filterValue});
  }

  formBuild() {
    this.filtersForm = new FormGroup({
      searchBy: new FormControl(''),
      select: new FormControl(''),
    })
  }

}
