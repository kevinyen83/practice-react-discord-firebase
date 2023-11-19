import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EMPTY, Subject, throwError } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';

import { RosterService } from '../../../../core/services/roster/roster.service';
import { ResourcesService } from 'app/core/services/resource/resources.service';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { AccountService } from 'app/core/services/account/account.service';
import { FuseAlertService, FuseAlertType } from "../../../../../@fuse/components/alert";

@Component({
  selector: 'app-shift-details',
  templateUrl: './shift-details.component.html'
})
export class ShiftDetailsComponent implements OnInit, OnDestroy {
  @Input() viewAs;
  @Input() connectedVenues;
  @Output() closeSideBar = new EventEmitter<any>();
  @Output() openingChangelog = new EventEmitter<any>();
  @Output() cancelingShift = new EventEmitter<any>();
  @Output() editingShift = new EventEmitter<any>();
  @Output() releasingShift = new EventEmitter<any>();

  // @Input() currentShift;
  shiftInPast = false;
  shiftDetailsForm: FormGroup;
  resourcesRequirements: FormArray;
  statusResource: FormControl;
  statusSupplier: FormControl;
  statusClient: FormControl;
  currentClient;
  currentResource;
  currentSupplier;
  unsubscribeAll = new Subject<any>();
  currentShift: any = {};
  defaultAvatar;
  isDirectVenue = false;
  showAlert = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  openedTask = null;
  selectedUsers = [];
  blockedIcons: boolean = false;
  currentAccount;
  currentAccountRole: string;

  tasksSortedByRole = [];
  disableAnimation = true;

  constructor(
    public rosterService: RosterService,
    private avatarService: AvatarService,
    private resourcesService: ResourcesService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private _fuseAlertService: FuseAlertService
  ) {
    this.statusResource = this.formBuilder.control('');
    this.statusSupplier = this.formBuilder.control('');
    this.statusClient = this.formBuilder.control('');
  }

  ngOnInit(): void {
    this.initForm();
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.rosterService.currentShift
      .pipe(
        switchMap((res) => {
          this.currentShift = res;
          this.tasksSortedByRole = [];
          const _tasksortedByRole = [];
          this.shiftInPast = moment(this.currentShift?.datetime).isBefore(moment());
          if (this.currentShift?.uuid) {
            this.currentShift.start = moment(this.currentShift?.datetime);
            this.currentShift.end = moment(this.currentShift.start).add(this.currentShift.duration, 'minutes');
            if (this.currentShift.start.isBefore(moment())) {
              this.blockedIcons = true;
            } else {
              this.blockedIcons = false;
            }
            this.putControls();

            this.currentShift.tasks.forEach((task) => {

              let roleInd = _tasksortedByRole.findIndex((role) => role.name == task?.role?.name);
              if (roleInd != -1) {
                _tasksortedByRole[roleInd].tasks.push(task);
              } else {
                _tasksortedByRole.push({
                  name: task?.role?.name,
                  tasks: [task]
                });
              }
            });
            this.tasksSortedByRole = _tasksortedByRole;
          }
          return this.accountService.currentAccount;
        }),
        tap((res: any) => {
          this.currentAccount = res;
          if (this.currentShift.uuid) {
            let clients = [
              this.currentAccount,
              ...this.currentAccount.clients
            ] || [this.currentAccount];
            // let suppliers = this.currentAccount.suppliers || [];
            // let resources = this.accountService.connectedResources.getValue();
            this.currentClient = clients.find((cl) => cl.uuid === this.currentShift.client_uuid);
            let currentVenue = this.connectedVenues.find(v => v?.venue.uuid === this.currentShift?.venue?.uuid && v?.client?.uuid === this.currentShift.client_uuid);
            if (currentVenue) {
              this.isDirectVenue = true;
            }
            this.checkCurrentAccount();
            // this.currentResource = resources.find(
            //   (resource) => resource.uuid === this.currentShift.resource.uuid
            // );
          }
          // there are mullitple suppliers and resources which are user the task array.
          // they contain the names and other details to display on each of them
          // return this.resourcesService.getRoles();
        }),
        // tap((res: any) => this.roles = res),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          this.handleError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => (this.disableAnimation = false));
  }

  checkCurrentAccount() {
    let currentSupplier = this.currentShift?.tasks.some(task => task.supplier.uuid === this.currentAccount.uuid);
    let currentClient = this.currentShift.client_uuid === this.currentAccount.uuid;
    if (currentSupplier) {
      this.currentAccountRole = 'supplier';
    } else if (currentClient) {
      this.currentAccountRole = 'client'
    }
  }

  getStatusOfShift(currentShift) {
    return currentShift.tasks.some(t => t.timesheet?.signon?.signature && !t.timesheet?.signoff?.signature) ||
      currentShift.tasks.some(t => t.timesheet?.signoff?.signature &&
        !moment(t.timesheet?.signoff?.datetime).isBefore(moment(currentShift.datetime)));
  }

  oneTaskIsAccepted() {
    let isAcceptTask = this.currentShift.tasks.some(t => t.supplier.release_status === 2);
    return isAcceptTask;
  }

  changeStatusClient(task, status) {
    this.rosterService.changeStatusClient(this.currentAccount.uuid, task, status).pipe(
      tap(res => {
        if (status === 3) {
          this.getAlert('Task was successfully declined');
        } else if (status === 2) {
          this.getAlert('Task was successfully accepted');
        }
      })
    ).subscribe();
  }

  isSupplierOfTheTask() {
    return this.currentShift.tasks.some(t => t.supplier.uuid === this.currentAccount.uuid);
  }

  acceptShift(shift) {
    this.rosterService.acceptShiftAsTheClient(shift.uuid).pipe(
      tap(res => {
        this.rosterService.currentShift = res;
        this.getAlert('Shift was successfully accepted');
      })
    ).subscribe();
  }

  getStatus(status, user) {
    return this.rosterService.getStatus(status, user);
  }

  getStatusColor(status, user) {
    return this.rosterService.getStatusColor(status, user);
  }

  isSignedTask() {
    return this.currentShift.tasks.some(t => t.timesheet?.signon?.signature)
  }

  declineShift(shift) {
    this.rosterService.declineShiftAsTheClient(shift.uuid).pipe(
      tap(res => {
        this.rosterService.currentShift = res;
        this.getAlert('Shift was successfully declined');
      })
    ).subscribe();
  }

  getAlert(message) {
    this.alert.message = message;
    this.showAlert = true
    setTimeout(() => {
      this.showAlert = false;
    }, 3000)
  }

  // changeStatus(event, user) {
  //   if (user === 'resource') {
  //     this.rosterService
  //       .changeStatusResource(this.currentAccount.uuid, this.currentShift, event.value)
  //       .pipe(
  //         // takeUntil(this.unsubscribeAll),
  //         catchError((error) => this.handleError(error))
  //       )
  //       .subscribe();
  //   } else if (user === 'client') {
  //     this.rosterService
  //       .changeStatusClient(this.currentAccount.uuid, this.currentShift, event.value)
  //       .pipe(
  //         // takeUntil(this.unsubscribeAll),
  //         catchError((error) => this.handleError(error))
  //       )
  //       .subscribe();
  //   } else if (user === 'supplier') {
  //     this.rosterService
  //       .changeStatusSupplier(this.currentAccount.uuid, this.currentShift, event.value)
  //       .pipe(
  //         // takeUntil(this.unsubscribeAll),
  //         catchError((error) => this.handleError(error))
  //       )
  //       .subscribe();
  //   }
  // }

  initForm() {
    this.shiftDetailsForm = new FormGroup({
      resourcesRequirements: new FormArray([])
    });
  }

  createItemResource() {
    return new FormGroup({
      shiftRole: new FormControl(''),
      shiftNumber: new FormControl(''),
      changeRate: new FormControl('')
    });
  }

  addResourcesField() {
    this.resourcesRequirements = this.shiftDetailsForm.controls.resourcesRequirements as FormArray;
    this.resourcesRequirements.push(this.createItemResource());
  }

  handleError(err): any {
    if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
      return throwError(err);
    } else {
      this.rosterService.currentShift = this.currentShift;
      this.snackBar.open('You do not have permission to Accept on behalf of this profile', 'X', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return EMPTY;
    }
  }

  get resourcesRequirementsControls() {
    return this.shiftDetailsForm.get('resourcesRequirements') as FormArray;
  }

  toCurrentClient(client_uuid) {
    this.rosterService.toCurrentClient(client_uuid);
  }

  toCurrentSupplier(supplier_uuid) {
    this.rosterService.toCurrentSupplier(supplier_uuid);
  }

  toCurrentResource(resource_uuid) {
    this.rosterService.toCurrentResource(resource_uuid);
  }

  putControls() {
    this.statusClient.patchValue(this.currentShift?.client_release_status);
    this.statusResource.patchValue(this.currentShift?.resource_status);
    this.statusSupplier.patchValue(this.currentShift?.supplier_status);
  }

  openChangelog() {
    this.openingChangelog.emit();
  }

  close() {
    this.closeSideBar.emit('descriptions');
  }

  cancelShift() {
    this.cancelingShift.emit(this.currentShift);
    this.close();
  }

  releaseShift() {
    this.releasingShift.emit(this.currentShift);
  }

  editShift() {
    this.editingShift.emit(this.currentShift);
    this.close();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
