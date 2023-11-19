import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";

@Component({
  selector: 'app-buttons-clients-venues',
  templateUrl: './buttons-clients-venues.component.html'
})
export class ButtonsClientsVenuesComponent implements OnInit {
  @Input() showAddVenue: boolean = true;
  editing: boolean;

  constructor(private headerButtonService: HeaderButtonService) { }
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.headerButtonService.updateTemplate(this.buttonsTemplate);
  }

  ngOnDestroy(): void {
    this.headerButtonService.updateTemplate(null)
  }
  openAddVenue() {
    this.editing = true;
    this.headerButtonService.changeView('addVenue');
 }

 cancelVenue() {
  this.editing = false;
  this.headerButtonService.changeView('cancelVenue');
}

saveVenue() {
  this.editing = false;
  this.headerButtonService.saveAccountDetails('saveVenue');
}
}
