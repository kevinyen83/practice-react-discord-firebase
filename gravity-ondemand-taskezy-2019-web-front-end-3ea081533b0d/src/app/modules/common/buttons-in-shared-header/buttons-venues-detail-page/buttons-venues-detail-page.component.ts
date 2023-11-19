import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-buttons-venues-detail-page',
  templateUrl: './buttons-venues-detail-page.component.html'
})
export class ButtonsVenuesDetailPageComponent implements OnInit {
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  constructor(private headerButtonService: HeaderButtonService) { }
  editing: boolean;

  @Input() venue;
  @Input() currentAccount;
  @Input() addNewVenue = false;
  @Input() showEdit = false;
  @Input() showDelete = false;
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.headerButtonService.updateTemplate(this.buttonsTemplate);
  }

  ngOnDestroy(): void {
    this.headerButtonService.updateTemplate(null)
  }

  venueDelete(){
    this.headerButtonService.changeView('deleteVenue');
  }

 cancelVenue() {
    this.editing = false;
    this.headerButtonService.getConfirmation().afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        this.headerButtonService.isEditing.next('cancelVenue');
      }
    });
  }

  venueSaveForVenueDetails(){
    this.editing = false;
    this.headerButtonService.changeView('saveVenue');
  }

  venueEdit(){
    this.editing = true
    this.headerButtonService.changeView('edit');
  }
  cancelAdd(){
    this.editing = true
    this.headerButtonService.changeView('cancelAddingVenue');
  }
  saveVenue(){
    this.editing = true
    this.headerButtonService.changeView('saveAddingVenue');
  }
  toClose(){
    this.editing = true
    this.headerButtonService.changeView('closeAddingVenue');
  }
}
