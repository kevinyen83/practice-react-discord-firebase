import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-venue-compliance',
  templateUrl: './venue-compliance.component.html',
  animations: fuseAnimations
})
export class VenueComplianceComponent implements OnInit {
  spinnerSearch: boolean = false;
  searchAbn: FormControl;
  notificationABN: string;
  operatingData = [{}, {}, {}, {}];
  trainingData = [{name: 'Billy'}, {name: 'Gibby'}, {name: 'Lucy'}];
  engagementData = [{}, {}, {}, {}];
  dataSourceOperatingRegulations: MatTableDataSource<any>;
  dataSourceTraining: MatTableDataSource<any>;
  dataSourceEngagement: MatTableDataSource<any>;
  displayedColumns = ['name'];
  engagementColumns = ['commencementDate', 'term', 'contractRenewalDate', 'keyContractTerms', 'additionalComments'];

  constructor() {
    this.searchAbn = new FormControl('');
  }

  ngOnInit(): void {
    this.dataSourceOperatingRegulations = new MatTableDataSource<any>(this.operatingData);
    this.dataSourceTraining = new MatTableDataSource<any>(this.trainingData);
    this.dataSourceEngagement = new MatTableDataSource<any>(this.engagementData);
  }

  searchingAbn() {

  }

}
