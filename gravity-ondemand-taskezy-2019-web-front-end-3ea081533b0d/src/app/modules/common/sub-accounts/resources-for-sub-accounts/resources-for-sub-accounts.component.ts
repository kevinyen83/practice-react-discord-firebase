import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";

@Component({
  selector: "app-resources-for-sub-accounts",
  templateUrl: "./resources-for-sub-accounts.component.html",
  animations: fuseAnimations
})
export class ResourcesForSubAccountsComponent implements OnInit {
  currentDate = new Date();
  status: FormControl;
  formSearch: FormGroup;
  displayedColumns = [
    "logo",
    "resourceName",
    "email",
    "phoneNumber",
    "type",
    "status"
  ];
  dataSource: MatTableDataSource<any>;
  venues = [];
  ratings = [];
  licenceTypes = [];
  selecting = [];

  @Input() resources;
  @Input() accountType;
  @Output() updateView = new EventEmitter<any>();

  constructor() {
    this.status = new FormControl("");
  }

  ngOnInit(): void {
    this.formBuild();
    this.dataSource = new MatTableDataSource<any>(this.resources);
  }

  changeSearchBy(event) {
    if (event.value === "venue") {
      this.selecting = this.venues;
    }
    if (event.value === "rating") {
      this.selecting = this.ratings;
    }
    if (event.value === "resource") {
      this.selecting = [];
      this.resources.forEach((res) => {
        this.selecting = [...this.selecting, res.detail.name];
      });
    }
    if (event.value === "licence Type") {
      this.selecting = this.licenceTypes;
    }
  }

  viewResource(row) {
    this.updateView.emit(row);
  }

  formBuild() {
    this.formSearch = new FormGroup({
      searchBy: new FormControl(""),
      select: new FormControl(""),
    });
  }

  search() {
    let searchByValue = this.formSearch.get("searchBy").value;
    let selected = this.formSearch.get("select").value;
  }

  inviteResource() {
    this.updateView.emit();
  }
}
