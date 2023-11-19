import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-reports-tab',
  templateUrl: './reports-tab.component.html',
  animations: fuseAnimations
})
export class ReportsTabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
