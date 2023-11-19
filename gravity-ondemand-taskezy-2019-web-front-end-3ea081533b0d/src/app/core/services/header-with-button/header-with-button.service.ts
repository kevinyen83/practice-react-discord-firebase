import { Injectable, TemplateRef } from '@angular/core';
import { AccountService } from '../account/account.service';
import { BehaviorSubject, EMPTY, Observable, catchError, forkJoin, switchMap, tap, Subject } from 'rxjs';
import { DetailsTabComponent } from 'app/modules/pages/primary-account/details-page/details-tab/details-tab.component';
import { DetailsFormComponent } from "../../../modules/common/sub-accounts/details-form/details-form.component";
import { FormGroup } from "@angular/forms";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";

@Injectable({
  providedIn: 'root'
})
export class HeaderButtonService {
  private templateSource = new BehaviorSubject<TemplateRef<any>>(null)
  template$ = this.templateSource.asObservable();
  editing: boolean;

  venueForm: FormGroup;
  isEditing = new Subject<string>();
  isChangeStatus = new Subject<string>();
  isSaved = new Subject<string>();
  isVenueTab= new BehaviorSubject<string>("VENUE_DETAILS_TAB");
  isAccountDetails =new Subject<string>()

  // venueEditing = new Subject<string>();
  // venueSaved = new Subject<string>();
  // editing: boolean;
  // detailsForm: any;
  // currentAvatar: string;
  // currentAccount: any;
  // viewSpinner: boolean;
  // alert: { type: string; message: string; };
  // showAlert: boolean;
  // detailFormCopy: any;

  constructor(private _fuseConfirmationService: FuseConfirmationService) {}

  //   private headerButtonClickSubject = new BehaviorSubject<string>('');

  //   public onHeaderButtonClick(): Observable<string> {
  //     return this.headerButtonClickSubject.asObservable();
  //   }

  //   public emitHeaderButtonClick(action: string): void {
  //     this.headerButtonClickSubject.next(action);
  //   }

  updateTemplate(template: TemplateRef<any>): void {
    this.templateSource.next(template);
  }

  testFunction(){
    console.log("service is working")
  }

  //trying to implement functions from details-tab.components.ts
  saveAccountDetails(view) {
    this.isSaved.next(view);

    // this.detailsTabComponent.saveDetails();
  }

  changeStatus(status) {
    this.isChangeStatus.next(status);
  }
// saveAccountDetails(currentAccount: any, currentAvatar: string, detailsForm: any) {
//   let accountDetails = {
//     logo: currentAvatar || '',
//     phone: detailsForm.get('phoneNumber').value,
//     website: detailsForm.get('website').value,
//     industry: detailsForm.get('primaryIndustry').value,
//     primary_address: detailsForm.get('primaryAddress').value,
//     postal_address: detailsForm.get('postAddress').value
//   };

//   return this.accountService.updateDetail(currentAccount.uuid, accountDetails)
//     .pipe(
//       switchMap(() => {
//         return forkJoin(this.accountService.getAllAccounts(), this.accountService.setCurrentAccount(currentAccount.uuid));
//       }),
//       tap((data) => {
//         // Handle success case
//       }),
//       catchError((err) => {
//         console.log(err);
//         return EMPTY;
//       })
//     );
// }

    changeView(view) {
      this.isEditing.next(view);
    }

    getConfirmation() {
      const dialogRef = this._fuseConfirmationService.open({
        title: `Do you want to close the panel?`,
        message: 'The form will not be saved.',
        icon: {
          show: false
        },
        actions: {
          confirm: {
            show: true,
            label: 'Yes, close',
            color: 'primary'
          },
          cancel: {
            show: true,
            label: 'Cancel'
          }
        }
      });
      console.log("check dialogRef: ", dialogRef)
      return dialogRef;
    }


}
//original functions
  // saveDetails() {
  //   let accountDetails = {
  //     logo: this.currentAvatar || '',
  //     phone: this.detailsForm.get('phoneNumber').value,
  //     website: this.detailsForm.get('website').value,
  //     industry: this.detailsForm.get('primaryIndustry').value,
  //     primary_address: this.detailsForm.get('primaryAddress').value,
  //     postal_address: this.detailsForm.get('postAddress').value
  //   };

  //   this.accountService
  //     .updateDetail(this.currentAccount.uuid, accountDetails)
  //     .pipe(
  //       switchMap(() => {
  //         return forkJoin(this.accountService.getAllAccounts(), this.accountService.setCurrentAccount(this.currentAccount.uuid));
  //       }),
  //       tap((data) => {
  //         this.editing = false;
  //         this.viewSpinner = false;
  //         this.alert = {
  //           type: 'success',
  //           message: 'Your Account Details are saved.'
  //         };
  //         this.showAlert = true;
  //       }),
  //       catchError((err) => {
  //         console.log(err);
  //         return EMPTY;
  //       })
  //       // takeUntil(this.unsubscribeAll)
  //     )
  //     .subscribe();
  // }

  // editDetails() {
  //   this.editing = true;
  // }

  // cancelEdit() {
  //   this.editing = false;
  //   // clear the edits and go back to previous data
  //   this.detailsForm.setValue(this.detailFormCopy);
  // }
// }
