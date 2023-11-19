import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-buttons-detail-page',
  templateUrl: './buttons-detail-page.component.html'
})
export class ButtonsDetailPageComponent implements OnInit {
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  editing: boolean;
  constructor(private headerButtonService: HeaderButtonService) { }
  // view: string;;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.headerButtonService.updateTemplate(this.buttonsTemplate);
  }

  ngOnDestroy(): void {
    this.headerButtonService.updateTemplate(null)
  }

  isCancelEdit(){
    this.editing = false
    this.headerButtonService.getConfirmation().afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        this.headerButtonService.isEditing.next('details');
      }
    });
  }

  saveDetails() {
    this.editing = false;
    this.headerButtonService.saveAccountDetails('details');
  }

  isEditDetails(){
    // console.log("isEditDetails", 'details')
    this.editing = true
    this.headerButtonService.changeView('details');
  }

}
