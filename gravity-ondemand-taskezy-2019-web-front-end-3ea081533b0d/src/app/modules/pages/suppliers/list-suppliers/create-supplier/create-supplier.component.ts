import { Component, OnDestroy, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { tap, combineLatest, Subject, EMPTY } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';

import { fuseAnimations } from '@fuse/animations';
import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import {HeaderButtonService} from "../../../../../core/services/header-with-button/header-with-button.service";
@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreateSupplierComponent implements OnInit, OnDestroy {
  @Output() closeCreate = new EventEmitter<any>();
  status = '';
  showAlert: boolean;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  suppliers = [];
  unsubscribeAll = new Subject<any>();
  selectedAccount: any = null;
  currentAccount: any = {};
  pageTitle = 'Add New Supplier';
  statusForm = 'create';
  isEditingValue;
  constructor(private accountService: AccountService, private suppliersService: SuppliersService, private _fuseConfirmationService: FuseConfirmationService, private route: ActivatedRoute, private router: Router, private headerButtonService: HeaderButtonService) {}

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
            this.suppliers = this.currentAccount.suppliers;
          } else {
            this.suppliers = [];
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
  }

  changedStatus(event) {
    this.statusForm = event;
  }

  backListSuppliers() {
    this.router.navigate(['pages/list-suppliers']);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
