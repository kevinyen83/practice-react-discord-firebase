import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";

@Component({
  selector: 'app-buttons-detail-acrreditations-page',
  templateUrl: './buttons-detail-acrreditations-page.component.html'
})
export class ButtonsDetailAcrreditationsPageComponent implements OnInit {
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  constructor(private headerButtonService: HeaderButtonService) { }
  // @Output() goToAddAccreditations = new EventEmitter<any>();
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.headerButtonService.updateTemplate(this.buttonsTemplate);
  }

  ngOnDestroy(): void {
    this.headerButtonService.updateTemplate(null)
  }
  handleAddAccreditation() {
    this.headerButtonService.changeView('addAccreditations')
    // this.goToAddAccreditations.emit();
  }

}
