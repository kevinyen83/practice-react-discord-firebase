
import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-filter-client-supplier',
  templateUrl: './filter-client-supplier.component.html',
  animations: fuseAnimations
})
export class FilterClientSupplierComponent implements OnInit {
  constructor() {
    this.select = new FormControl("");
    this.managedType = new FormControl("");
    this.sorting = new FormControl("");
   }
  @Output() closeSideBar = new EventEmitter<any>();
  select: FormControl;
  sorting: FormControl;
  managedType: FormControl;
  @Output() updateList = new EventEmitter<any>()
  currentFilter: string;
  selects = [];
  managedTypes = [];
  @Input() currentUser;
  @Input() users;
  @Input() selectedValue;
  shifts = [];
  selectedFilters = {
    status: [],
    managedType: []
  };

  unsubscribeAll = new Subject<any>();
  filteredClientsMulti = new BehaviorSubject<any>([]);
  filteredResourcesMulti = new BehaviorSubject<any>([]);
  filteredSuppliersMulti = new BehaviorSubject<any>([]);
  filteredVenuesMulti = new BehaviorSubject<any>([]);
  filteredStatusMulti = new BehaviorSubject<any>([]);

  ngOnInit(): void {
    this.selects = [ {name: 'Pending', value: 0}, {name: 'Active', value: 1},{name: 'Inactive', value: 2}, {name: 'Banned', value: 3}, {name: 'Waiting for Approval', value: 4}, {name: 'Failed', value: 5}, {name: 'Verified', value: 6}];
    this.managedTypes = [{name: 'Internally Managed', value: 9}, {name: 'Externally Managed', value: 10}]

    this.selectedValue?.subscribe((value) => {
      if(value > 8){
        const selectedValue = value
        const currentValue = this.managedType.value;
        const updatedValue = currentValue.filter(value => value !== selectedValue);
        this.managedType.setValue(updatedValue);

        this.updateList.emit({ filter: 'managed', value: updatedValue });
      }else if(value < 8){
        const selectedValue = value
        const currentValue = this.select.value;
        const updatedValue = currentValue.filter(value => value !== selectedValue);
        this.select.setValue(updatedValue);

        this.updateList.emit({ filter: 'status', value: updatedValue })
      }

    });

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  changeSelect(e,type) {
    if(type==='status'){
      const filterValue = this.select?.value
      this.updateList.emit({filter: 'status', value: filterValue});
    }
    if(type==='managed'){
      const filterValue = this.managedType?.value;
      this.updateList.emit({filter: 'managed', value: filterValue});
    }
  }
}
