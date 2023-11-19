import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { AccountService } from "app/core/services/account/account.service";

@Component({
  selector: "app-shift-filter",
  templateUrl: "./shift-filter.component.html",
})
export class ShiftFilterComponent implements OnInit {
  @Input() currentAccount;
  @Output() viewAddShift = new EventEmitter<any>();
  @Output() closeSideBar = new EventEmitter<any>();

  header = "Filters";
  status = "add";

  shiftChecked;

  venueList = [];
  resourceList = [];
  clientList = [];
  supplierList = [];
  statusList;

  filterForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public accountService: AccountService
  ) {}

  ngOnInit() {
    this.buildFilterForm();
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      venue: "",
      client: "",
      supplier: "",
      resource: "",
      status: "",
    });
  }

  cancelShift(event) {
    this.router.navigate(["/pages/roster"]);
  }

  closeSideNav() {
    this.closeSideBar.emit();
    // this.dialogRef.close();
  }

  changeFieldVenue($event) {}

  changeFieldClient($event) {}

  changeFieldSupplier($event) {}

  changeFieldResource($event) {}

  changeFieldStatus($event) {}
}
