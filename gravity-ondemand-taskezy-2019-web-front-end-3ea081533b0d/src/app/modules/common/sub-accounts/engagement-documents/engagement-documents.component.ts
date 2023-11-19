import { Component, Input, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-engagement-documents',
  templateUrl: './engagement-documents.component.html',
  animations: fuseAnimations
})
export class EngagementDocumentsComponent implements OnInit {
  spinnerSearch: boolean = false;
  documents = [];
  header = 'Other Documents';
  // type = 'venue';
  // _currentAccount;

  @Input() accountType;
  @Input() currentAccount;
  @Input() venue;
  @Input() venueClient;

  constructor() {}

  ngOnInit(): void {
    console.log(this.currentAccount);
    console.log(this.venueClient);
    console.log(this.venue);
    console.log(this.accountType);
  }

  saveDocuments(event) {
    this.documents.push(event);
  }
}
