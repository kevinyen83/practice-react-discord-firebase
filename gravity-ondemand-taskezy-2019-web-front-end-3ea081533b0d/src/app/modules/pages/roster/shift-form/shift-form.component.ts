import { Component, ElementRef, EventEmitter, Input, OnInit, Output, OnDestroy, AfterViewChecked } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';
import {Subject, EMPTY, of, iif, defer, from as observableFrom, concatMap, combineLatest} from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';

import { RosterService } from '../../../../core/services/roster/roster.service';
import { AccountService } from 'app/core/services/account/account.service';
import { SearchByUsersComponent } from '../search-by-users/search-by-users.component';
import { AvatarService } from 'app/core/services/avatar/avatar.service';
import { TaskChecklistComponent } from '../task-checklist/task-checklist.component';
import { fuseAnimations } from '@fuse/animations';
import {ChangeResourceComponent} from "../change-resource/change-resource.component";

@Component({
  selector: 'app-shift-form',
  templateUrl: './shift-form.component.html',
  animations: fuseAnimations
})
export class ShiftFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() header;
  @Input() status;
  @Input() data: any = {};
  @Input() currentShift;
  @Input() viewAs;
  @Output() closeSideNav = new EventEmitter<any>();

  unsubscribeAll = new Subject();
  resourcesRequirements: FormArray;
  viewSpinner = false;

  currentDate;
  endDateMin;

  addShiftForm: FormGroup;

  suppliers = [];

  clients = [];
  allResources = [];
  resourcesForTemplate = [];
  resourcesForSearch = [];

  allResourcesAndSuppliers = [];
  suppliersAndResources = [];

  selectedClientVenues = [];
  selectedClient: any = {};
  selectedVenue: any = {};
  currentAccount: any;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean;
  notificationAccreditation = '';
  defaultAvatar;
  isChangedTasks = false;
  existingTasks = [];
  isSelectedTasksLength = false;

  releaseAfterSave = false;

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              public rosterService: RosterService,
              private accountService: AccountService,
              private avatarService: AvatarService,
              private el: ElementRef) {}

  ngOnInit() {
    this.accountService.setPauseRefresh(true);

    this.currentDate = moment().add(1, 'h').startOf('h');
    this.viewSpinner = true;
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.createAddShiftForm();

    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          if (res) {
            this.currentAccount = res;
          }
          if (this.currentAccount.uuid) {
            if (this.currentAccount?.clients) {
              this.clients = [
                this.currentAccount,
                ...this.currentAccount?.clients
              ] || [this.currentAccount];
              this.selectedClient = this.clients[0];
            }
            if (this.currentAccount?.suppliers) {
              this.suppliers = [
                this.currentAccount,
                ...this.currentAccount?.suppliers
              ] || [this.currentAccount];
            }
            this.selectedClientVenues = this.selectedClient?.venues;
            if (this.currentAccount?.resources) {
              this.allResources = this.currentAccount?.resources;
            }

            if (this.status === 'edit' && this.currentShift) {
              this.selectedClient = this.clients.find((client) => client.uuid === this.currentShift.client_uuid);
              this.selectedClientVenues = this.selectedClient?.venues;
              this.selectedVenue = this.selectedClientVenues?.find((venue) => venue.uuid === this.currentShift?.venue?.uuid);
              this.createEditShiftForm();
              return;
            }
            //TODO: If No clients (self is selectable) or No venues.....they shouldnt be able to do much else.
            if (this.selectedClient?.venues && this.selectedClient?.venues.length == 0) {
              // return EMPTY;
              this.addShiftForm.get('venue').setErrors({ noVenuesError: true });
              this.addShiftForm.get('venue').markAsTouched();
            } else {
              if (this.selectedClientVenues?.length) {
                this.selectedVenue = this.selectedClientVenues[0];
              }

                if (this.data) {
                  if (this.data?.day) {
                    this.addShiftForm.get('startDatetime').patchValue(moment(this.data.day).startOf('d'));
                  }
                  if (this.data?.client) {
                    this.selectedClient = this.clients.find((client) => client.uuid === this.data.client);
                    this.selectedClientVenues = this.selectedClient?.venues;
                  }
                  if (this.data?.venue) {
                    this.selectedVenue = this.selectedClientVenues.find((venue) => venue.uuid === this.data.venue);
                  }
                }
                if (this.selectedVenue) {
                  this.addResourcesField();
                }


              this.addShiftForm.get('client').patchValue(this.selectedClient);
              this.addShiftForm.get('client').updateValueAndValidity();
              this.addShiftForm.get('venue').patchValue(this.selectedVenue);
              this.addShiftForm.get('venue').updateValueAndValidity();
            }
            // this.suppliersAndResources = res[2] || [];

            // if (this.allResources && this.allResources.length) {
            //   this.suppliersAndResources.forEach((s) => {
            //     if (s.resource.name && s.supplier.name) {
            //       this.resourcesForTemplate.push(s.resource.name + '-' + s.supplier.name);
            //     } else if (s.resource.name && !s.supplier.name) {
            //       this.resourcesForTemplate.push(s.resource.name);
            //     } else if (!s.resource.name && s.supplier.name) {
            //       this.resourcesForTemplate.push(s.supplier.name);
            //     }
            //   });
            //   this.resourcesForTemplate.sort();
            // }
            // this.resourcesForSearch = Object.assign([], this.resourcesForTemplate);
            // this.allResourcesAndSuppliers = Object.assign([], this.resourcesForSearch);
          }
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.viewSpinner = false;
        // this.valueChanges();
      });
  }

  get resourcesRequirementsControls() {
    return this.addShiftForm.get('resourcesRequirements') as FormArray;
  }

  changeRole(event) {}

  changeRate(i) {}

  changeNumber(i) {}

  ngAfterViewChecked() {}

  close() {
    this.addShiftForm.reset();
    this.createAddShiftForm();
    this.viewSpinner = false;
    this.closeSideNav.emit(true);
  }

  deleteSelectedResource(index, form) {
    form.selectedUsers.splice(index, 1);
    form.get('shiftNumber').patchValue(form.selectedUsers.length);
    // this.existingResourcesIds = this.existingResourcesIds.filter((id, i) => i !== index);
    // this.existingSuppliersIds = this.existingSuppliersIds.filter((s, inx) => inx !== index);
    this.isSelectedTasksLength = this.resourcesRequirementsControls.controls.some(el => el['selectedUsers'].length);
    let selectedTask = this.currentShift?.tasks.find((t, i) => i === index);
    this.existingTasks = this.existingTasks.filter(t => t !== selectedTask?.uuid);
    let hoursBeforeDate = Math.floor(moment.duration(moment(this.currentShift.datetime).diff(moment())).asHours());
    if (selectedTask && selectedTask?.uuid && hoursBeforeDate > 4) {
      this.deleteTask(selectedTask, this.currentShift).subscribe(res => {
        this.currentShift.tasks = this.currentShift.tasks.filter((t, i) => i !== index);
      });
    } else if (hoursBeforeDate < 4 && selectedTask?.resource?.uuid) {
      this.updateResourceStatus(selectedTask, 4, index);
    }
    this.isChangedTasks = true;
  }

  updateResourceStatus(task, status, idx) {
    this.rosterService.changeStatusResource(task, status).pipe(
      tap(res => {
        this.currentShift.tasks.slice(idx, 1, res);
        this.rosterService.currentShift = res;
      })
    ).subscribe();
  }

  search(index, form) {
    const selectedUsersList = this.resourcesRequirementsControls.controls.map((form: any) => form.selectedUsers).filter(item => item); // .map(item => item?.resource?.user_id)
    const selectedResourceIds = [];
    for(const usersItem of selectedUsersList) {
      for(const userItem of usersItem) {
        if(userItem?.resource?.user_id) {
          selectedResourceIds.push(userItem?.resource?.user_id)
        }
      }
    }

    if (form.invalid || !form.get('shiftNumber')?.value) {
      form.get('shiftNumber')?.setErrors({ err: true });
      return;
    }
    let valueRole = form.controls['shiftRole'].value;

    let selectedRole = this.selectedVenue.roles.find((r) => r.name === valueRole.name);
    this.accountService
      .getResourcesCredentialsRole(this.currentAccount, selectedRole?.uuid)
      .pipe(
        tap((res: any[]) => {
          if (res) {
            this.getModalSearch(form, res, selectedResourceIds);
          }
        })
        // takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  getModalSearch(form, listUsers, selectedResourceIds) {
    let ids = [];

    listUsers.forEach((u) => {
      if(!selectedResourceIds.includes(u.resource.user_id)) {
        ids.push(u.resource.user_id);
      }
      ids.push(u.supplier.uuid);
    });
    const dialogRef = this.dialog.open(SearchByUsersComponent, {
      width: '80%',
      data: {
        shift: this.addShiftForm.value,
        role: form.get('shiftRole').value,
        number: form.get('shiftNumber').value,
        users: {
          ids,
          foundedUsers: listUsers
        }
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (res.selectedResources) {
          form.selectedUsers = res.selectedResources.map((res) => {
            res.supervisor = false;
            return res;
          });
          form.get('shiftNumber').patchValue(form.selectedUsers.length);
        } else if (res.selectedSuppliers) {
          let selectedUsers = [];
          res.selectedSuppliers.forEach((selSup) => {
            for (let i = 0; i < selSup.number; i++) {
              selectedUsers.push({
                resource: {
                  user_id: null,
                  name: ''
                },
                supervisor: false,
                supplier: selSup
              });
            }
          });
          form.selectedUsers = selectedUsers;
          form.get('shiftNumber').patchValue(selectedUsers.length);

          // selected users = loop through suppliers and add tbd for each one?
        }
        this.isChangedTasks = true;
        this.isSelectedTasksLength = true;
      }
    });
  }

  onSelectClient(e) {
    this.selectedClient = e.value;
    this.selectedClientVenues = this.selectedClient.venues;
    this.selectedVenue = this.selectedClientVenues[0] || null;
    this.addShiftForm.get('venue').patchValue(this.selectedVenue);
    if (this.selectedClientVenues.length == 0) {
      this.addShiftForm.get('venue').setErrors({ noVenuesError: true });
      this.addShiftForm.get('venue').markAsTouched();
    } else {
      this.addShiftForm.get('venue').setErrors({ noVenuesError: null });
      this.addShiftForm.get('venue').markAsUntouched();
      this.addShiftForm.get('venue').updateValueAndValidity();
      this.resetAllRoles();
    }
  }

  onSelectVenue(e) {
    this.selectedVenue = e.value;
    this.resetAllRoles();
  }

  createEditShiftForm(): void {
    // const timeStart = moment(this.currentShift?.datetime).format('HH:mm');
    // const end = moment(this.currentShift.datetime).add(this.currentShift.duration);
    this.addShiftForm.patchValue({
      ['client']: this.selectedClient,
      ['venue']: this.selectedVenue,
      ['startDatetime']: moment(this.currentShift.datetime),
      // ['startTime']: timeStart,
      ['endDatetime']: moment(this.currentShift.datetime).add(this.currentShift.duration, 'm')
      // ['endTime']: end.format('HH:mm')
    });

    if (this.currentShift.release_status > 0) {
      this.addShiftForm.get('client').disable();
      this.addShiftForm.get('venue').disable();
      this.addShiftForm.get('startDatetime').disable();
      // this.addShiftForm.get('startTime').disable();
      this.addShiftForm.get('endDatetime').disable();
      // this.addShiftForm.get('endTime').disable();
    } else {
      this.addShiftForm.get('client').enable();
      this.addShiftForm.get('venue').enable();
      this.addShiftForm.get('startDatetime').enable();
      // this.addShiftForm.get('startTime').enable();
      this.addShiftForm.get('endDatetime').enable();
      // this.addShiftForm.get('endTime').enable();
    }

    //todo: go through tasks and seperate into role and count, then the actual chosen resources to build the form again here
    const resourceReq = [];
    this.currentShift.tasks.forEach((task) => {
      this.existingTasks.push(task.uuid);
      let ind = resourceReq.findIndex((req) => req.shiftRole.uuid == task.role.uuid);
      if (ind >= 0) {
        resourceReq[ind].resources.push({ resource: task.resource, supplier: task.supplier, supervisor: task.supervisor });
      } else {
        resourceReq.push({ shiftRole: task.role, resources: [{ resource: task.resource, supplier: task.supplier, supervisor: task.supervisor }] });
      }
    });
    resourceReq.forEach((req, ind) => {
      this.addResourcesField(req.shiftRole, req.resources.length);
      (this.resourcesRequirementsControls.controls[ind] as any).selectedUsers = req.resources.map((res) => {
        return res;
      });
    });
    this.resourcesRequirementsControls.controls.forEach((control, index) => {
      if (this.viewAs?.value === 'supplier' && control['selectedUsers'][index]?.supplier?.uuid !== this.currentAccount?.uuid) {
        control.get('shiftRole').disable();
        control.get('shiftNumber').disable();
      }
    });

    // this.resourcesRequirementsControls.controls[0].get('shiftRole').setValue(this.currentShift?.role);
    // this.resourcesRequirementsControls.controls[0].get('shiftNumber').setValue(this.currentShift?.resource?.number);
    // this.resourcesRequirements.controls[0].get('changeRate').patchValue(this.currentShift?.resource?.charge_rate);

    this.viewSpinner = false;

    this.addShiftForm.markAllAsTouched();
    this.addShiftForm.updateValueAndValidity();
  }

  roleCmp(s1, s2): boolean {
    return s1 && s2 ? s1.uuid === s2.uuid : s1 === s2;
  }

  createAddShiftForm(): void {
    this.addShiftForm = this.formBuilder.group({
      client: [
        null,
        Validators.required
      ],
      venue: [
        null,
        Validators.required
      ],
      startDatetime: [
        this.currentDate,
        Validators.required
      ],
      // startTime: ['', Validators.required],
      endDatetime: [
        moment(this.currentDate).add(4, 'h'),
        Validators.required
      ],
      // endTime: ['', Validators.required],
      resourcesRequirements: this.formBuilder.array([])
    });
  }

  isDurationZero(): boolean {
    const startTime = new Date(this.addShiftForm.value.startDatetime);
    const endTime = new Date(this.addShiftForm.value.endDatetime);

    // Check if either start or end time is invalid
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return false;
    }

    // Calculate the duration and check if it is 0
    const duration = Math.abs(endTime.getTime() - startTime.getTime());
    return duration === 0;
  }

  createItemResourceEmpty(num?) {
    if (num) {
      return new FormGroup({
        shiftRole: new FormControl(null, Validators.required),
        shiftNumber: new FormControl(num, Validators.required)
        // changeRate: new FormControl('')
      });
    } else {
      return new FormGroup({
        shiftRole: new FormControl(null, Validators.required),
        shiftNumber: new FormControl(0, Validators.required)
        // changeRate: new FormControl('')
      });
    }
  }

  addResourcesField(role?, num?) {
    if (role) {
      (this.addShiftForm.get('resourcesRequirements') as FormArray).push(this.createItemResourceEmpty(num));
      const len = (this.addShiftForm.get('resourcesRequirements') as FormArray).length - 1;
      (this.addShiftForm.get('resourcesRequirements') as FormArray).controls[len].get('shiftRole').setValue(this.selectedVenue?.roles?.length >= 1 ? this.selectedVenue?.roles[0] : {});
    } else {
      (this.addShiftForm.get('resourcesRequirements') as FormArray).push(this.createItemResourceEmpty());
      const len = (this.addShiftForm.get('resourcesRequirements') as FormArray).length - 1;
      (this.addShiftForm.get('resourcesRequirements') as FormArray).controls[len].get('shiftRole').setValue(this.selectedVenue?.roles?.length >= 1 ? this.selectedVenue?.roles[0] : {});
    }
  }

  removeResourceRequirements(i) {
    (this.addShiftForm.get('resourcesRequirements') as FormArray).removeAt(i);
  }

  resetAllRoles() {
    (this.addShiftForm.get('resourcesRequirements') as FormArray).controls.forEach((roles) => {
      roles.get('shiftRole').setValue(this.selectedVenue.roles?.length >= 1 ? this.selectedVenue.roles[0] : {});
    });
  }

  timeDif() {
    const shiftForm = this.addShiftForm.value;
    if (shiftForm.endDatetime) {
      const dur = moment.duration(shiftForm.endDatetime.diff(shiftForm.startDatetime)).asMinutes();
      return ~~(dur / 60) + ' h ' + (dur % 60) + ' m';
    } else {
      return '---';
    }
    // return '---';
    // const startTime = this.addShiftForm.get('startTime').value;
    // const endTime = this.addShiftForm.get('endTime').value;
    // if (startTime && endTime) {
    //   const startDateTime = moment(this.addShiftForm.get('startDate').value);
    //   startDateTime.set({
    //     hours: startTime.format('HH'),
    //     minutes: startTime.format('mm')
    //   });
    //   const endDateTime = moment(this.addShiftForm.get('endDate').value);
    //   endDateTime.set({
    //     hours: endTime.format('HH'),
    //     minutes: endTime.format('mm')
    //   });
    //   return moment.utc(endDateTime.diff(startDateTime)).format('HH [h] mm [m]');
    // } else {
    //   return '---';
    // }
  }

  saveAndRelease() {
    if (!this.viewSpinner) {
      this.viewSpinner = true;
      this.releaseAfterSave = true;
      this.save();
    }
  }

  changeDate(event, control) {
    this.addShiftForm.get(control).setValue(event.value);
  }

  save() {
    this.addShiftForm.markAllAsTouched();
    if (this.addShiftForm.valid || this.addShiftForm.disabled) {
      const shiftForm = this.addShiftForm.getRawValue();

      const duration = moment.duration(moment(shiftForm.endDatetime).diff(moment(shiftForm.startDatetime))).asMinutes();

      const shift = {
        account_uuid: this.currentAccount.uuid,
        client_uuid: shiftForm.client.uuid,
        venue_uuid: shiftForm.venue.uuid,
        datetime: shiftForm.startDatetime.format(),
        duration,
        notes: '',
        tasks: this.buildTasks(this.resourcesRequirementsControls)
      };


      if (this.status === 'add' || this.status === 'addWithData') {
        this.createShift(shift);
      } else if (this.status === 'edit') {


        shift['uuid'] = this.currentShift?.uuid;

        if (!this.addShiftForm.pristine) {
          this.updateShift(shift);
        } else if (this.isChangedTasks) {
          if (this.viewAs?.value === "supplier") {

          } else {
            if (shift?.tasks.length) {
              combineLatest([this.removeOldTasks(this.currentShift?.tasks),
                this.updateTasksList(shift?.tasks)])
                .subscribe(
                  (res: any[]) => {
                    this.currentShift = res[1];
                    this.rosterService.currentShift = this.currentShift;
                    this.close();
                  });
            } else {
              this.removeOldTasks(this.currentShift?.tasks).subscribe(
                res => {
                  this.currentShift = res;
                  this.rosterService.currentShift = this.currentShift;
                  this.close();
                });
            }
          }
        } else {
          this.close();
        }
      }
    }
  }

  updateTasksList(array) {
    return observableFrom(array).pipe(
      concatMap((el: any, index) => {
        return this.convertTasks('create', el, this.currentShift);
      })
    );
  }

  changeResource(user) {
    let foundTask = this.currentShift?.tasks?.find(t => t.supplier.uuid === user.supplier.uuid);
    let credentials = foundTask?.credentials.filter(c => c.category || c.accreditation);
    let relevantResources = [];
    this.accountService.getResourcesCredentialsRole(this.currentAccount, foundTask?.role?.uuid).pipe(
      tap((res: any) => {
        relevantResources = credentials ? res : res.filter(r => credentials.some(c => c.category && r.resource?.formdata?.tags.includes(c.category)));
        const dialogRef = this.dialog.open(ChangeResourceComponent, {
          width: '80%',
          data: {
            task: foundTask,
            resources: relevantResources
          }
        });
      })
    ).subscribe();
  }

  removeOldTasks(array) {
    if (array.length) {
      return observableFrom(array).pipe(
        concatMap((el: any, index) => {
          if (this.existingTasks.includes(el.uuid)) {
            return this.convertTasks('delete', el, this.currentShift);
          } else {
            return of(this.currentShift);
          }
        })
      );
    } else {
      return of(this.currentShift);
    }
  }

  createTask(shift, task) {
    return this.rosterService
      .createTask(shift, task, this.selectedVenue?.roles, this.allResources);
  }

  updateTask(task, uuid) {
    this.rosterService
      .updateTask(uuid, task)
      .pipe(tap((res) => {}));
  }

  deleteTask(task, shift) {
    return this.rosterService
      .deleteTask(task.uuid, shift).pipe(
        tap((res: any) => {
          if (res && res?.message.toLowerCase().includes('deleted')) {
            this.currentShift.tasks = this.currentShift.tasks.filter(t => t.uuid !== task.uuid);
          }
        }),
        catchError(err => {
          return of(err);
        })
      );
  }

  convertTasks(status, task, shift) {
    return iif(
      () => status === 'delete',
      defer(() => this.deleteTask(task, shift)),
      defer(() => this.createTask(shift, task)))
  }

  buildTasks(resourceReqs) {
    const tasks = [];

    resourceReqs?.controls.forEach((resReq) => {
      let addEmpty = 0;
      if (resReq.selectedUsers) {
        resReq.selectedUsers.forEach((selectedUser) => {
          let task = {
            role_uuid: resReq.value.shiftRole.uuid,
            credentials: resReq.value.shiftRole.credentials,
            note: '',
            resource_uuid: selectedUser.resource.user_id || '',
            supervisor: selectedUser.supervisor,
            supplier_uuid: selectedUser.supplier.uuid,
            task_items: resReq.taskList || []
          }

          tasks.push(task);
        });
        addEmpty = resReq.value.shiftNumber - resReq.selectedUsers.length;
      } else {
        addEmpty = resReq.value.shiftNumber;
      }
      // for (let i = 0; i < addEmpty; i++) {
      //   tasks.push({
      //     role_uuid: resReq.value.shiftRole.uuid,
      //     credentials: resReq.value.shiftRole.credentials,
      //     note: '',
      //     resource_uuid: '',
      //     supervisor: false,
      //     supplier_uuid: '',
      //     task_items: resReq.taskList || []
      //   });
      // }
    });
    return tasks;
  }

  changeStart(event) {
    this.endDateMin = event;
  }

  changeEnd(event) {}

  createShift(shift) {
    this.rosterService
      .createShift(this.currentAccount.uuid, shift)
      .pipe(
        // take(1),
        tap((res: any) => {
          this.rosterService.currentViewDate = shift['datetime'];
          // this.countClick = 0;
          // this.addShiftForm.get('venue').patchValue('');
          // // this.addShiftForm.get("startDay").patchValue('');
          // this.addShiftForm.get('startTime').patchValue('');

          if (this.releaseAfterSave) {
            this.releaseShift(res);
          } else {
            this.close();
          }
        }),
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          this.viewSpinner = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateShift(shift) {
    this.rosterService
      .updateShift(this.currentAccount.uuid, shift)
      .pipe(
        take(1),
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          this.viewSpinner = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.rosterService.currentViewDate = shift['datetime'];
        // this.rosterService.currShift = null;
        this.close();
        // this.countClick = 0;
        this.viewSpinner = false;
      });
  }

  toControl() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid:not(form)');
    invalidControl.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'nearest'
    });
  }

  releaseShift(shift) {
    return this.rosterService
      .releaseShift(shift)
      .pipe(
        tap((res) => {
          this.close();
          this.viewSpinner = false;
        }),
        // takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          this.viewSpinner = false;
          return of({ shift, ok: false, reason: err.message });
        })
      )
      .subscribe();
  }

  openTaskChecklist(form) {
    const dialogRef = this.dialog.open(TaskChecklistComponent, {
      width: '782px'
      //TODO: pass in the current task checklist if there is one, it comes in from form variable
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // TODO: whatever is here needs to be saved along that set of resource requirements
        // which is pased in here from the from variable
      }
    });
  }

  // saveDraft() {
  //   if (this.currentShift) {
  //     this.rosterService.currentViewDate = this.currentShift.datetime;
  //   }
  //   this.save();
  //   // this.close();
  // }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    this.accountService.setPauseRefresh(false);
  }
}
