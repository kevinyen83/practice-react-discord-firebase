import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { fuseAnimations } from '@fuse/animations';

import { Observable, of } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";

import { RosterService } from "../../../../core/services/roster/roster.service";

@Component({
  selector: 'app-filters-of-roster-header',
  templateUrl: './filters-of-roster-header.component.html',
  animations: fuseAnimations
})
export class FiltersOfRosterHeaderComponent implements OnInit {
  filtersForm: FormGroup;
  sorting: FormControl;
  nameOfUser: FormControl;
  usersForTemplate: Observable<string[]>;
  options = [];
  _shifts = [];
  reserveShifts = [];
  selectedStatuses = [];
  byUser: string;

  @Input() chips;
  @Input() resources;
  @Input() clients;
  @Input() suppliers;
  @Input() set shifts(value) {
    if (value) {
      this._shifts = value;
      this.reserveShifts = this.rosterService.allShifts;
    }
  };

  @Output() clearFilters = new EventEmitter<any>();
  @Output() changeShifts = new EventEmitter<any>();
  @Output() changeStatus = new EventEmitter<any>();

  constructor(private rosterService: RosterService) { }

  ngOnInit(): void {
    this.buildForm();
    this.filtersForm.get('nameOfUser').valueChanges.pipe(
      tap(res => {
        this.options = [...this.resources, ...this.suppliers, ...this.clients];
      }),
      startWith(''),
      map(value => this.usersForTemplate = this._filter(value)),
    ).subscribe();
  }

  // filtering() {
  //   // this.usersForTemplate = this.filtersForm.get('nameOfUser').valueChanges.pipe(
  //   //   startWith(''),
  //   //   map(value => this._filter(value)),
  //   // );
  // }

  // changeSorting(event) {
  //   this.filtersForm.get('nameOfUser').setValue('');
  //   this.options = [];
  //   if (event.value === 'Resources') {
  //     this.options = this.resources;
  //     this.byUser = 'resource';
  //   }
  //   if (event.value === 'Clients') {
  //     this.options = this.clients;
  //     this.byUser = 'client';
  //   }
  //   if (event.value === 'Suppliers') {
  //     this.options = this.suppliers;
  //     this.byUser = 'supplier';
  //   }
  //   this.filtering();
  // }

  changeField() {
    // let value = this.filtersForm.get('nameOfUser').value;
    // if (!value) {
    //   this.clearFilters.emit();
    // }
  }

  selectedValueUser(event) {
    let clients = [];
    let result = [];
    let res = [];
    if (event) {
        // this.rosterService.selectedNameFilters = event;
        let client = this.options.find(c => c?.detail?.name === event || c?.name === event);
        if (client.user_id) {
          clients.forEach(cl => {
            cl.shifts = cl.shifts.filter(s => s.tasks.some(t => t.resource.name === event));
          });
          res = clients.filter(cl => cl.shifts && cl.shifts.length);
        } else {
          clients.forEach(cl => {
            cl.shifts = cl.shifts.filter(s => s.tasks.some(t => t?.supplier?.name === event));
          });
          res = clients.filter(cl => cl.shifts && cl.shifts.length || cl.uuid === client.uuid || cl.shifts.some(s => s.client_uuid === client.uuid));
        }
        result = this._shifts.filter(shift => shift['client_uuid'] === client.uuid);
    } else {
      clients = [...this.clients];
      result = [...this._shifts];
    }
    this.rosterService.selectedNameResult = {
      shifts: result,
      clients: [...res]
    }
    this.
    changeShifts.emit(this.rosterService.selectedNameResult);
  }

  buildForm() {
    this.filtersForm = new FormGroup({
      sorting: new FormControl(''),
      nameOfUser: new FormControl(''),
      completed: new FormControl(false),
      inProgress: new FormControl(false),
      review: new FormControl(false),
      alert: new FormControl(false),
      cancelled: new FormControl(false),
      draft: new FormControl(false)
    })
  }

  changeSelect(status, event) {
    if (event.checked) {
      this.selectedStatuses.push(status);
    }
    if (!event.checked) {
      this.selectedStatuses = this.selectedStatuses.filter(value => value !== status);
    }
    this.rosterService.selectedStatuses = this.selectedStatuses;
    this.changeStatus.emit();
  }


  private _filter(value: string): Observable<any> {
    const filterValue = value;

    return of(this.options.filter(option => option?.name ? option?.name.includes(filterValue) : option?.detail?.name.includes(filterValue)));

      // return this.options.filter(option => option?.detail?.name.includes(filterValue));

  }

}
