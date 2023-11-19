import { AccountService } from 'app/core/services/account/account.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SuppliersService } from 'app/core/services/supplier/suppliers.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { ClientsService } from 'app/core/services/client/clients.service';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';

@Component({
  selector: 'app-documents-view',
  templateUrl: './documents-view.component.html'
})
export class DocumentsViewComponent implements OnInit, OnDestroy {
  @Input() selectedAccount;
  @Input() user;
  @Output() showForm = new EventEmitter<any>();
  @Input() status;

  currentAccount: any;
  currentUser: any;
  unsubscribeAll = new Subject<any>();
  viewSpinner = false;

  constructor(
    private router: Router,
    private documentsService: DocumentsService,
    private _fuseNavigationService: FuseNavigationService,
    private accountService: AccountService,
    private suppliersService: SuppliersService,
    private resourcesService: ResourcesService,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.accountService.currentAccount
      .pipe(
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((currAccount) => {
        this.currentAccount = currAccount;
        if (this.user === 'account') {
          this.selectedAccount = this.currentAccount;
        }
      });
    this.userProfileService.currentUser
      .pipe(
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((currUser) => {
        this.currentUser = currUser;
      });
  }

  deleteDocument(i) {
    this.viewSpinner = true;
    this.selectedAccount.documents = this.selectedAccount.documents.filter((doc, index) => i !== index);
    if (this.user === 'supplier') {
      this.suppliersService
        .updateSupplier(this.currentUser.uuid, this.selectedAccount.uuid, this.selectedAccount)
        .pipe(
          // takeUntil(this.unsubscribeAll),
          catchError((err) => {
            console.log(err);
            this.viewSpinner = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.viewSpinner = false;
        });
    } else if (this.user === 'resource') {
      this.resourcesService
        .updateResource(this.currentUser.uuid, this.selectedAccount.uuid, this.selectedAccount)
        .pipe(
          // takeUntil(this.unsubscribeAll),
          catchError((err) => {
            console.log(err);
            this.viewSpinner = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.viewSpinner = false;
        });
    } else if (this.user === 'client') {
      this.clientsService
        .updateClient(this.currentUser.uuid, this.selectedAccount.uuid, this.selectedAccount)
        .pipe(
          // takeUntil(this.unsubscribeAll),
          catchError((err) => {
            console.log(err);
            this.viewSpinner = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.viewSpinner = false;
        });
    } else if (this.user === 'account') {
      this.documentsService
        .updateDocuments(this.selectedAccount.uuid, this.selectedAccount.documents)
        .pipe(
          // takeUntil(this.unsubscribeAll),
          catchError((err) => {
            console.log(err);
            this.viewSpinner = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.viewSpinner = false;
        });
    }
  }

  cancelDocumentsNotes() {
    if (this.user === 'supplier') {
      this.router.navigate(['/pages/list-suppliers']);
    }
    if (this.user === 'resource') {
      if (!this.currentUser.resources || !this.currentUser?.resources.length) {
        this.router.navigate(['/welcome']);
      }
      if (this.currentUser.resources || this.currentUser?.resources.length) {
        this.router.navigate(['/pages/list-resources']);
      }
    }
    if (this.user === 'client') {
      this.router.navigate(['/pages/list-clients']);
    }
  }

  saveProfileDone() {
    if (this.status === 'create') {
      if (!this.selectedAccount?.uuid.length) {
        this.snackBar.open('Please save the whole information', 'X', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        return;
      }

      if (!this.selectedAccount.detail.individual && !this.selectedAccount?.detail?.abn) {
        this.snackBar.open('Please save the detail section', 'X', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        return;
      }

      if (!this.selectedAccount?.addresses || !this.selectedAccount?.addresses.length) {
        this.snackBar.open('Please save the address section', 'X', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        return;
      }

      if (!this.selectedAccount?.accreditation || this.selectedAccount?.accreditation.length === 0) {
        this.snackBar.open('Please save the accreditation section', 'X', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        return;
      }

      if (this.selectedAccount && this.selectedAccount.detail.tfn && this.selectedAccount.typeOfAccount === 'resource') {
        this.accountService
          .setCurrentAccount(this.selectedAccount.uuid)
          .pipe(
            catchError((err) => {
              console.log(err);
              this.viewSpinner = false;
              return EMPTY;
            })
            // takeUntil(this.unsubscribeAll)
          )
          .subscribe((res) => {
            this.toggleDisabled('account', 'primary-account');
            this.toggleDisabled('resources', 'resources');
            // this._fuseNavigationService.removeNavigationItem('resources');
            // this._fuseNavigationService.removeNavigationItem('clients');
            this.toggleDisabled('clients', 'clients');
            // this._fuseNavigationService.removeNavigationItem('list-venues');
            this.toggleDisabled('list-venues', 'list-venues');
            // this._fuseNavigationService.removeNavigationItem('list-templates');
            this.toggleDisabled('list-templates', 'list-templates');
            // this._fuseNavigationService.removeNavigationItem('suppliers');
            this.toggleDisabled('suppliers', 'suppliers');
            // this._fuseNavigationService.removeNavigationItem('admin');
            this.toggleDisabled('admin', 'admin');
            // this._fuseNavigationService.removeNavigationItem('swap-profile');
            this.toggleDisabled('swap-profile', 'swap-profile');
            // this._fuseNavigationService.removeNavigationItem('list-assessments');
            this.toggleDisabled('list-assessments', 'list-assessments');
            // this._fuseNavigationService.removeNavigationItem('interviews');
            this.toggleDisabled('interviews', 'interviews');
            // this._fuseNavigationService.removeNavigationItem('resource-pool');
            this.toggleDisabled('resource-pool', 'resource-pool');
            this.router.navigate(['/pages/home']);
          });
        return;
      }

      this.cancelDocumentsNotes();
    } else {
      this.cancelDocumentsNotes();
    }
  }

  toggleDisabled(itemId, navigationName): void {
    // Get the component -> navigation data -> item
    const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(navigationName);

    // Return if the navigation component does not exist
    if (!navComponent) {
      return null;
    }

    // Get the navigation item, update the badge and refresh the component
    const navigation = navComponent.navigation;
    const item = this._fuseNavigationService.getItem(itemId, navigation);
    item.disabled = !item.disabled;
    navComponent.refresh();
  }

  addDocumentsNotes() {
    this.showForm.emit('add');
  }

  editDocumentsNotes(i) {
    this.showForm.emit(i);
  }

  downloadFile(document) {
    this.documentsService
      .getFilesDownload(document.location)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe((res) => {
        if (res) {
          saveAs(res, document.title);
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
