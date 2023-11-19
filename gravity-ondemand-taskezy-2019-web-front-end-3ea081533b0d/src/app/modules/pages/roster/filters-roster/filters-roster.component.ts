import { Component, OnDestroy, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';
import { EMPTY, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AccountService } from 'app/core/services/account/account.service';
import { fuseAnimations } from '@fuse/animations';
import { RosterService } from '../../../../core/services/roster/roster.service';

@Component({
  selector: 'app-filters-roster',
  templateUrl: './filters-roster.component.html',
  animations: fuseAnimations
})
export class FiltersRosterComponent implements OnInit, OnDestroy, OnChanges {
  // @Input() suppliers;
  // @Input() resources;
  // @Input() clients;
  // @Input() set newShifts(value) {
  //   if (value) {
  //     this.shifts = value;
  //     this.reserveShifts = [...this.shifts];
  //   }
  // }
  @Input() reserveClients;
  @Input() connectedVenues;
  @Output() closeSideBar = new EventEmitter<any>();
  @Output() changeFilter = new EventEmitter<any>();
  @Output() changeShifts = new EventEmitter<any>();

  // shifts = [];
  filtersForm: FormGroup;
  searchClient: FormControl;
  searchVenue: FormControl;
  searchSupplier: FormControl;
  searchResource: FormControl;
  searchStatus: FormControl;
  activeFilter: any;
  selectedVenues = [];
  // reserveShifts = [];
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
  selectedViews = [];
  resultClients = [];

  unsubscribeAll = new Subject<any>();
  filteredClientsMulti = new Subject<any>();
  filteredResourcesMulti = new Subject<any>();
  filteredSuppliersMulti = new Subject<any>();
  filteredVenuesMulti = new Subject<any>();
  filteredStatusMulti = new Subject<any>();

  constructor(private accountService: AccountService, private rosterService: RosterService) {}

  ngOnInit(): void {
    this.buildForm();
    this.accountService.currentAccount
      .pipe(
        switchMap((account: any) => {
          this.currentAccount = account;
          if (this.currentAccount.uuid) {
            this.accountService.getConnectedResources(this.currentAccount.uuid);
            return this.accountService.connectedResources;
          }
          return of(null);
        }),
        tap((res: any) => {
          if (res) {
            this.venues = [...this.currentAccount?.venues];
            this.connectedVenues.forEach((v) => {
              let newVenue = this.venues.find((ven) => ven.uuid === v.venue.uuid);
              if (!newVenue) {
                this.venues.push(v.venue);
              }
            });

            this.resources = [...this.currentAccount.resources];
            res.forEach((r) => {
              let newResource = this.resources.find((resource) => resource.uuid === r.resource.uuid);
              if (!newResource) {
                this.resources.push(r);
              }
            });
            this.suppliers = this.currentAccount?.suppliers;
            this.clients = [
              ...this.currentAccount?.clients,
              this.currentAccount
            ];
            // this.reserveClients = [...this.clients];
          }
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        this.filteringData();
      });
    this.rosterService.changedFilter.subscribe((res) => {
      if (!res.key) {
        for (let c in this.selectedFilters) {
          if (Array.isArray(this.selectedFilters[c])) {
            this.filtersForm.get(c).patchValue([]);
          }
        }
      } else {
        Object.values(this.selectedFilters).forEach(v => {
          if (v.length) {
            let resource = this.resources.find(r => r.name === res.key);
            let client = this.clients.find(c => c.detail.name === res.key);
            let supplier = this.suppliers.find(s => s.detail.name === res.key);
            let venue = this.venues.find(v => v.name === res.key);
            let status = this.statuses.find(s => s === res.key);
            if (resource) {
              this.selectedFilters['resource'] = this.removeObjectWithId(this.selectedFilters['resource'], resource.uuid);
            }
            if (client) {
              this.selectedFilters['client'] = this.removeObjectWithId(this.selectedFilters['client'], client.uuid);
            }
            if (supplier) {
              this.selectedFilters['supplier'] = this.removeObjectWithId(this.selectedFilters['supplier'], supplier.uuid);
            }
            if (venue) {
              this.selectedFilters['venue'] = this.removeObjectWithId(this.selectedFilters['venue'], venue.uuid);
            }
            if (status) {
              this.selectedFilters['status'] = this.removeObjectWithId(this.selectedFilters['status'], status);
            }
            this.applyFilters();
          }
        });
      }
      this.close();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['connectedVenues']) {

        const currentValue = changes['connectedVenues'].currentValue;
        this.connectedVenues = currentValue;

        this.ngOnInit();
    }
}

  removeObjectWithId(arr, uuid) {
    const objWithIdIndex = arr.findIndex((id) => id === uuid);

    if (objWithIdIndex !== -1) {
      arr.splice(objWithIdIndex, 1);
    }

    return arr;
  }

  // combineShifts(res) {
  //   const shifts = [
  //     ...res[0],
  //     ...res[1],
  //     ...res[2],
  //     ...res[3]
  //   ];
  //   return shifts.filter((shift, index, self) => index === self.findIndex((t) => t.uuid === shift.uuid));
  // }

  onChangeFilter(filter, event) {
    if (event.value) {
      this.activeFilter = event.value;
      this.selectedFilters[filter] = event.value;
    } else if (!event.value) {
      this.selectedFilters[filter] = [];
    }
    this.changeFilter.emit(this.selectedFilters);
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
    this.changeFilter.emit(this.selectedFilters);
    // this.close();
  }

  close() {
    this.closeSideBar.emit();
  }

  // applyFilters() {
  //   this.applyFiltering();
  // }

  buildForm() {
    this.filtersForm = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      viewClient: new FormControl(true),
      client: new FormControl(''),
      searchClient: new FormControl(''),
      viewVenue: new FormControl(true),
      searchVenue: new FormControl(''),
      viewSupplier: new FormControl(true),
      searchSupplier: new FormControl(''),
      viewResource: new FormControl(true),
      searchResource: new FormControl(''),
      searchStatus: new FormControl(''),
      venue: new FormControl(''),
      supplier: new FormControl(''),
      resource: new FormControl(''),
      viewStatus: new FormControl(true),
      status: new FormControl(''),
      viewDraft: new FormControl(true)
    });
  }

  filteringData() {
    this.filteredSuppliersMulti.next([...this.suppliers]);
    this.filteredResourcesMulti.next(this.resources.filter((resource) => resource.detail.name !== ''));
    this.filteredClientsMulti.next(this.clients);
    this.filteredVenuesMulti.next([...this.venues]);
    this.filteredStatusMulti.next([...this.statuses]);
    this.filtersForm
      .get('searchSupplier')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((val) => {
        this.filterArrayMulti(this.suppliers, this.filteredSuppliersMulti, 'searchSupplier');
      });
    this.filtersForm
      .get('searchResource')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((val) => {
        this.filterArrayMulti(this.resources, this.filteredResourcesMulti, 'searchResource');
      });
    this.filtersForm
      .get('searchClient')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((val) => {
        this.filterArrayMulti(this.clients, this.filteredClientsMulti, 'searchClient');
      });
    this.filtersForm
      .get('searchVenue')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((val) => {
        this.filterArrayMulti(this.venues, this.filteredVenuesMulti, 'searchVenue');
      });
    this.filtersForm
      .get('searchStatus')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((val) => {
        this.filterArrayMulti(this.statuses, this.filteredStatusMulti, 'searchStatus');
      });
  }

  filterArrayMulti(array, filteredArray, control) {
    if (!array) {
      return;
    }
    // if (control === 'clientsWithNoShifts' && !this.selectedFilters.clientsWithNoShifts) {
    //   filteredArray.next(array);
    // }
    // if (control === 'clientsWithNoShifts' && this.selectedFilters.clientsWithNoShifts) {
    //   filteredArray.next(array.filter(item => !item.shifts || !item.shifts.length))
    // }
    let search = this.filtersForm.get(control).value;
    if (!search) {
      filteredArray.next([...array]);
      return;
    } else {
      search = search.toLowerCase();
    }
    if (control === 'searchVenue') {
      filteredArray.next(array.filter((item) => item.name.toLowerCase().indexOf(search) > -1));
    } else {
      filteredArray.next(array.filter((item) => item.detail.name.toLowerCase().indexOf(search) > -1));
    }
  }

  changeView(event, field) {
    this.selectedFilters[field] = event.checked;
  }

  private get Predicates(): Array<any> {
    const filters = this.selectedFilters;

    return Object.keys(filters).map((name: string) => {
      if (Array.isArray(filters[name]) && filters[name].length) {
        if (name === 'supplier') {
          return (item) =>
            filters[name].some((value) => {
              item.shifts = item.shifts.filter((s) => s.tasks.find((t) => t.supplier.uuid === value));
              if (item.shifts.length) {
                return { ...item };
              }
            });
        }
        if (name === 'client') {
          return (item) =>
            filters[name].some((value) => {
              return item.uuid === value;
            });
        }
        if (name === 'resource') {
          return (item) =>
            filters[name].some((value) => {
              item.shifts = item.shifts.filter((s) => s.tasks.find((t) => t.resource.uuid === value));
              if (item.shifts.length) {
                item.venues.forEach((v) => {
                  if (v.shifts.length) {
                    v.shifts = _.intersection(v.shifts, item.shifts);
                  }
                });
                return { ...item };
              }
            });
        }
        if (name === 'venue') {
          let venues = [];
          let uniqVenues = [];
          return (item) =>
            filters[name].some((value, i) => {
              if (!uniqVenues.includes(value)) {
                uniqVenues.push(value);
                venues.push(...item.venues.filter(v => v.uuid === value.toString()));

                if (i === filters[name].length - 1) {
                  item.venues = [...venues];
                  return {...item};
                }
              }
            });
        }
        if (name === 'status') {
          return (item) =>
            filters[name].some((value) => {
              if (value === 'Released to client') {
                item.shifts = item.shifts.filter((s) => s.release_history.find((h) => h.system_note.includes('client')));
                if (item.shifts.length) {
                  item.venues.forEach((v) => {
                    if (v.shifts.length) {
                      v.shifts = _.intersection(v.shifts, item.shifts);
                    }
                  });
                  return { ...item };
                }
              }
              if (value === 'Released to supplier') {
                item.shifts = item.shifts.filter((s) => s.release_history.find((h) => h.system_note.includes('supplier')));
                if (item.shifts.length) {
                  item.venues.forEach((v) => {
                    if (v.shifts.length) {
                      v.shifts = _.intersection(v.shifts, item.shifts);
                    }
                  });
                  return { ...item };
                }
              }
              if (value === 'Released to resources') {
                item.shifts = item.shifts.filter((s) => s.release_history.find((h) => h.system_note.includes('resource')));
                if (item.shifts.length) {
                  item.venues.forEach((v) => {
                    if (v.shifts.length) {
                      v.shifts = _.intersection(v.shifts, item.shifts);
                    }
                  });
                  return { ...item };
                }
              }
            });
        }
      }
      // if (name === 'dateFrom') {
      //   return (item) => moment(item.datetime).isAfter(moment(filters[name]));
      // }
      // if (name === 'dateTo') {
      //   return (item) => moment(item.datetime).isBefore(moment(filters[name]));
      // }
      // if (name === 'year' && filters[name] !== undefined) {
      //   year = filters[name];
      //   this.currentDate = moment().set({'year': year, 'week': week});
      //   return (item) => moment(item.startDay).format('YYYY') === moment(filters[name]).format('YYYY');
      // }
      // if (name === 'week' && filters[name] !== undefined) {
      //     week = filters[name];
      //     this.currentDate = moment().set({'year': year, 'week': week});
      //     return (item) => moment(item.startDay).isoWeek() === filters[name];
      //   }
      // if (name === 'day' && filters[name] !== undefined) {
      //     day = filters[name];
      //     this.currentDate = moment().set({'year': year, 'week': week});
      //     return (item) => moment(item.startDay).weekday() === filters[name];
      // }
      return (t) => true;
    });
  }

  deleteFilter(filter): void {
    this.rosterService.changedFilter.next({ key: filter });
  }

  applyFilters() {

    //TODO: this should now be done here. the filter component should just emit the selected filters and the roster component should do the filtering
    let result = [];
    let updatedShifts = [];
    this.resultClients = [];
    let res = [];
    const predicates = this.Predicates;
    if (Object.values(this.selectedFilters).some(v => v.length)) {
      res = [...this.reserveClients].filter((client) => predicates.every((predicate) => predicate(client)));
    }
    if (res && res.length) {
      result = [
        ...res,
        ...result
      ];
      this.resultClients = result;

      result.map((c) => {
        if (c?.shifts) {
          updatedShifts = [
            ...updatedShifts,
            ...c?.shifts
          ];
        }
      });
    }
    let newView = {
      shifts: updatedShifts,
      filters: { ...this.selectedFilters },
      clients: [...this.resultClients]
    };
    this.rosterService.selectedFilters = {...this.selectedFilters};
    this.rosterService.selectedShifts = newView;
    this.changeFilter.emit({ ...this.selectedFilters });
    this.changeShifts.emit(newView);
    this.close();
    this.resultClients = [];
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
