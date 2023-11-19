import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-tabs-detail',
  templateUrl: './tabs-detail.component.html',
  animations : fuseAnimations
})
export class TabsDetailComponent implements OnInit {

  activeIndex = 0;
  isOpenedList = false;
  @Output() goToNextPage = new EventEmitter<any>();

  @Input() buttons;
  @Input() subTabs;
  @Input() currentResource;
  @Input() currentVenue;
  @Input() selectedAccount;

  constructor() { }

  ngOnInit(): void {
  }

  selectedTab(index) {
    this.activeIndex = index;
    this.currentResource = null;
    this.currentVenue = null

    this.goToNextPage.emit(this.buttons[index].name);
  }

  selectSubTab(i) {
    this.goToNextPage.emit(this.subTabs[i])
  }

}
