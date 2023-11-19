import { Component, OnInit, TemplateRef, ViewChild,ChangeDetectorRef, Input } from '@angular/core';
import { HeaderButtonService } from '../../../../core/services/header-with-button/header-with-button.service';

@Component({
  selector: 'app-buttons-create-new-clients-suppliers',
  templateUrl: './buttons-create-new-clients-suppliers.component.html',

})
export class ButtonsCreateNewClientsSuppliersComponent implements OnInit{

  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;
  editing: boolean; false;
  detailPageCheck: boolean;
  @Input() label;
  constructor(private headerButtonService: HeaderButtonService ,private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.headerButtonService.isAccountDetails.subscribe(res => {
      if (res === 'details') {
        this.detailPageCheck = true
      }
      if(res==='notDetails'){
        this.detailPageCheck = false
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.headerButtonService.updateTemplate(this.buttonsTemplate);
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.headerButtonService.updateTemplate(null)
  }
  isCancelEdit(){
    this.headerButtonService.isAccountDetails.next('notDetails')
    this.headerButtonService.changeView('backToAdd');
  }

  saveDetails() {
    this.headerButtonService.changeView('saveNew');
  }

  toClose(){
    this.headerButtonService.getConfirmation().afterClosed().subscribe((res) => {
      if(res=='confirmed'){
    this.headerButtonService.isEditing.next('cancelAdd');
      }
    });
  }
}


