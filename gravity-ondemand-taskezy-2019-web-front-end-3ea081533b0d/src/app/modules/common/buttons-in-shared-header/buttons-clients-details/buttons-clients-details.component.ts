import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { AccountService  } from 'app/core/services/account/account.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-buttons-clients-details',
  templateUrl: './buttons-clients-details.component.html'
})
export class ButtonsClientsDetailsComponent implements OnInit {
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate: TemplateRef<any> | null = null;

  editing: boolean; false;
  // suppliersService: any;
  subAccount
  subAccountUUID
  subAccountPicked
  subAccountConnectionStatus
  subAccountEditable: boolean
  constructor(private headerButtonService: HeaderButtonService,
    private suppliersService: SuppliersService,
    private route: ActivatedRoute,
    private accountService: AccountService) {}



  ngOnInit(): void {
    this.route?.params?.pipe(
      switchMap(params => {
        this.subAccountUUID = params['id'];
        return this.accountService.currentAccount;
              })
    ).subscribe(currentAccount => {
      this.subAccount = currentAccount;
      if(this.subAccount?.suppliers.find(res => res?.uuid == this.subAccountUUID)){
        this.subAccountPicked = this.subAccount?.suppliers.find(res => res?.uuid == this.subAccountUUID);
        if(this.subAccount.uuid == this.subAccountPicked.uuid){
          //supplier - user logs in using supplier account
          this.subAccountEditable = true
        }else{
          //supplier - user logs in using different account
          this.subAccountEditable = false
        }
      }else if(this.subAccount?.clients.find(res => res?.uuid == this.subAccountUUID)){
        this.subAccountPicked = this.subAccount?.clients.find(res => res?.uuid == this.subAccountUUID);
        if(this.subAccountPicked.invitation.email){
          if(this.subAccount.uuid == this.subAccountPicked.uuid){
            //externally managed client - user logs in using externally managed account
            this.subAccountEditable = true
          }else{
            //externally managed client - user logs in using different account
            this.subAccountEditable = false
          }
        }else{
          //internally managed client
          this.subAccountEditable = true
        }
      }
      this.subAccountConnectionStatus = this.subAccountPicked.connection_status
    });

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
        this.headerButtonService.isEditing.next('subAccount');
      }
    });
  }

  saveDetails() {
    this.editing = false;
    this.headerButtonService.saveAccountDetails('subAccount');
  }

  isEditDetails(){
    // console.log("isEditDetails", 'details')
    this.editing = true
    this.headerButtonService.changeView('subAccount');
  }
}
