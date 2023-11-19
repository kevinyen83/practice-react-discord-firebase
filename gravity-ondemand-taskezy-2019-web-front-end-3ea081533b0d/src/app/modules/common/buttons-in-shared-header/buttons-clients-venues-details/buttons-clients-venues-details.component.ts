import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-buttons-clients-venues-details',
  templateUrl: './buttons-clients-venues-details.component.html'
})
export class ButtonsClientsVenuesDetailsComponent implements OnInit {
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  @Input() showDelete: boolean = false;

  constructor(private headerButtonService: HeaderButtonService) { }

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

}
