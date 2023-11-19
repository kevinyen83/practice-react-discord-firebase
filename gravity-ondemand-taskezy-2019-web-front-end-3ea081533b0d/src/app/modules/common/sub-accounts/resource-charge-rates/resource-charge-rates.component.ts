import { Component, Input, OnInit } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-resource-charge-rates',
  templateUrl: './resource-charge-rates.component.html'
})
export class ResourceChargeRatesComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['venue', 'week', 'month', 'year'];

  @Input() rates;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.rates);
  }

}
