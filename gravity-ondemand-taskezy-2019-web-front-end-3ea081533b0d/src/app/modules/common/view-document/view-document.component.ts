import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html'
})
export class ViewDocumentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

}
