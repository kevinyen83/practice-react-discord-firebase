import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-buttons-resources-details-active',
  templateUrl: './buttons-resources-details-active.component.html'
})
export class ButtonsResourcesDetailsActiveComponent implements OnInit {
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  // activeStatus
  @Input() currentResource;
  editing: boolean = false;
  constructor(private headerButtonService: HeaderButtonService) { }

  ngOnInit(): void {
    // this.headerButtonService.activeStatus.subscribe(res => {
    //   this.activeStatus == res
    //   console.log("check activeStatus from service :", res)
    // })
  }

  ngAfterViewInit(): void {
    this.headerButtonService.updateTemplate(this.buttonsTemplate);
  }

  ngOnDestroy(): void {
    this.headerButtonService.updateTemplate(null)
  }

  activate() {
    this.headerButtonService.changeStatus('activate');
  }

  deactivate() {
    this.headerButtonService.changeStatus('deactivate');
  }
}
