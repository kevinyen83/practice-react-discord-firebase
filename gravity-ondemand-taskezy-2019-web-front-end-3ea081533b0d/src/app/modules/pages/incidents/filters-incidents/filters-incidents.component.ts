import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-filters-incidents',
  templateUrl: './filters-incidents.component.html',
  animations: fuseAnimations
})
export class FiltersIncidentsComponent implements OnInit, OnDestroy {
  // @Input() suppliers;
  // @Input() resources;
  // @Input() clients;
  // @Input() set newShifts(value) {
  //   if (value) {
  //     this.shifts = value;
  //     this.reserveShifts = [...this.shifts];
  //   }
  // }
  // @Input() changedFilter;
  @Output() closeSideBar = new EventEmitter<any>();

  shifts = [];
  filtersForm: FormGroup;
  searchClient: FormControl;
  searchVenue: FormControl;
  searchSupplier: FormControl;
  searchResource: FormControl;
  searchStatus: FormControl;
  activeFilter: any;
  selectedVenues = [];
  reserveShifts = [];
  venues = [];
  statuses = [
    'Released to client',
    'Released to supplier',
    'Released to resources'
  ];
  selectedFilters = {
    supplier: [],
    client: [],
    resource: [],
    venue: [],
    status: []
  };

  currentAccount;
  suppliers = [];
  resources = [];
  clients = [];
  reserveClients;
  selectedViews = [];
  resultClients = [];

  unsubscribeAll = new Subject<any>();
  filteredClientsMulti = new BehaviorSubject<any>([]);
  filteredResourcesMulti = new BehaviorSubject<any>([]);
  filteredSuppliersMulti = new BehaviorSubject<any>([]);
  filteredVenuesMulti = new BehaviorSubject<any>([]);
  filteredStatusMulti = new BehaviorSubject<any>([]);

  constructor() {}

  ngOnInit(): void {
    this.buildForm();
  }

  close() {
    this.closeSideBar.emit();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  onChangeFilter(str, e) {

  }

  resetFilters() {
    this.filtersForm.reset();
    this.selectedFilters = {
      client: [],
      resource: [],
      status: [],
      supplier: [],
      venue: []
    };
  }

  applyFilters() {
    this.applyFiltering();
    localStorage.setItem('filterRoster', JSON.stringify(this.selectedFilters));
  }

  buildForm() {
    this.filtersForm = new FormGroup({
      // startDate: new FormControl(''),
      // endDate: new FormControl(''),
      // viewClient: new FormControl(true),
      client: new FormControl(''),
      searchClient: new FormControl(''),
      // viewVenue: new FormControl(true),
      searchVenue: new FormControl(''),
      // viewSupplier: new FormControl(true),
      searchSupplier: new FormControl(''),
      // viewResource: new FormControl(true),
      searchResource: new FormControl(''),
      searchStatus: new FormControl(''),
      venue: new FormControl(''),
      supplier: new FormControl(''),
      resource: new FormControl(''),
      // viewStatus: new FormControl(true),
      status: new FormControl(''),
      // viewDraft: new FormControl(true)
    });
  }


    applyFiltering() {

    }
}
