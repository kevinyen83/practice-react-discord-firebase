import { Component, OnDestroy, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, takeUntil } from 'rxjs/operators';
import { combineLatest, Subject, EMPTY } from 'rxjs';
import { tap } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';

import { AccountService } from 'app/core/services/account/account.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import {HeaderButtonService} from "../../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CreateClientComponent implements OnInit, OnDestroy {
  status;
  index = 0;
  clients: any = [];
  pageTitle = 'Add New Client';
  statusForm = 'create';
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean;
  unsubscribeAll = new Subject<any>();
  selectedAccount: any = null;
  currentAccount: any = {};
  isEditingValue;
  @Output() closeCreate = new EventEmitter<any>();

  constructor(private accountService: AccountService, private _fuseConfirmationService: FuseConfirmationService, private route: ActivatedRoute,
    private headerButtonService: HeaderButtonService) {}

  ngOnInit() {

    this.headerButtonService.isEditing.subscribe(res => {
      if (res === 'cancelAdd') {
        this.isEditingValue = res
        this.toClose()
      }
    });
    let params;
    combineLatest([
      this.accountService.currentAccount,
      this.route.params
    ])
      .pipe(
        tap((res: any) => {
          this.currentAccount = res[0];
          params = res[1];

          if (this.currentAccount.suppliers) {
            this.clients = this.currentAccount.suppliers;
          } else {
            this.clients = [];
          }
          if (this.currentAccount.uuid) {
            if (params.id === 'create') {
              this.status = 'create';
              this.pageTitle = 'Add New Supplier';
              this.accountService.resetSelectedAccount(this.status);
              this.selectedAccount = this.accountService.selectedAccount.getValue();
            }
          }
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  toClose() {
    if (this.accountService.isEditingAccount && this.isEditingValue !== 'cancelAdd') {
      const dialogRef = this._fuseConfirmationService.open({
        title: `Do you want to close the invitation panel?`,
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
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.closeCreate.emit();
          this.accountService.closedDrawer.next(true);
          this.accountService.isEditingAccount = false;
        }
      });
    } else {
      this.closeCreate.emit();
      this.accountService.closedDrawer.next(true);
    }
    console.log("this.accountService.isEditingAccount check: ", this.accountService.isEditingAccount)
  }

  changedStatus(event) {
    this.statusForm = event;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
