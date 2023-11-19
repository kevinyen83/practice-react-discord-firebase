import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";

// import * as moment from "moment";
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import { takeUntil } from "rxjs/operators";
import { Subject, tap } from "rxjs";

import { AvatarService } from "app/core/services/avatar/avatar.service";
import { RosterService } from "../../../../core/services/roster/roster.service";
import { AccountService } from 'app/core/services/account/account.service';
import { RoundUpPipe } from '../../../../shared/pipes/roundUp.pipe';

enum Result {
  Unresolved = 0,
  Billable = 1,
  NonBillable = 2
}

@Component({
  selector: 'app-timesheet-table-users',
  templateUrl: './timesheet-table-users.component.html',
  providers: [RoundUpPipe]
})
export class TimesheetTableUsersComponent implements OnInit, OnDestroy {

  _shifts = [];
  _clientsForView = [];
  defaultAvatar;
  openedshift;
  commentControl: FormControl;
  subTotalSplitControl: FormControl;
  breakSplitControl: FormControl;
  additionalSubTotal: FormControl;
  additionalBreakControl: FormControl;
  additionalSubTotalControl: FormControl;
  signOnCheckbox: FormControl;
  signOffCheckbox: FormControl;
  breakCheckbox: FormControl;
  savedSplitTimes = false;
  savedAdditionalTimes = true;
  signOff;
  break = 0;
  signOnDate;
  signOffDate;
  breakDate;
  errorTotalSplit: boolean;
  errorTotalBreak: boolean;
  errorRequiredSplit: boolean;
  errorRequiredAdditional: boolean;
  currentshift: any;
  newField = false;
  viewResources = false;
  newFieldResult = 'Billable';
  viewFields = false;
  additionalField = false;
  commentView = false;
  isComment = false;
  checkedSignon = true;
  checkedSignoff = true;
  checkedBreak = true;
  openedIndex: number;
  openedCommentIndex;
  unsubscribeAll = new Subject();
  commentStatus = '';
  currentTaskUUID: string;
  currentSplit;
  editingSplit;
  editingAdditional;
  currentAdditional;
  uuidOpenedComment: string;
  uuidCreateComment: string;
  totalTime;
  totalSplitTime;
  totalBreakTime;
  remainderSubTime: number = -1;
  remainderBreakTime: number = -1;
  remainderTotalTime: number = -1;
  remainderResult: number = 0;
  remainderItemCode: number = 0;
  remainderChargeRate: number = 0;
  splitTimeEdit: boolean = false;
  newSplits: any[] = [];
  editingAdditionalTime:boolean = false;
  additionalTimeResult = 'Billable'
  shiftRole;
  getShiftStatus;
  currentAccount;
  selectedAdditionalTime: number;
  selectedAdditionalTimeShift;
  isEditing: boolean = false;
  private roundUpPipe = new RoundUpPipe();
  public roundedNumber: number;

  itemsCode = [
    {name: '#6-2010', description: '[description]'},
    {name: '#7-2010', description: '[description]'},
    {name: '#8-2010', description: '[description]'},
    {name: '#9-2010', description: '[description]'}
  ]
  rows: any[] = [{id: 1}];
  tableForms: FormGroup[] = [];
  myGroup: FormGroup;

  @Input() set clientsForView(val) {
    if (val) {
      this._clientsForView = val;
    }
  };
  @Input() shiftsColumns;
  @Input() status;
  @Input() set shifts(val) {
    if (val) {
      this._shifts = val;
      this._shifts.forEach(s => {
        s.tasks?.forEach(t => {
          let savedAdditional = this.countSavedTimes(t?.timesheet?.additional_times);
          t.defaultSavedAdditional = savedAdditional;
          t['resultMenu'] = 'Billable';
          t.openedComment = false;
          t.timesheet.allBreak = this.getBreak(t);
          t.timesheet.subTotal = this.calculateSubTotal(t, t?.timesheet?.signon?.datetime, t?.timesheet?.signoff?.datetime);
          t.timesheet.total = this.getTotal(Number(t.timesheet.subTotal) / 60, Number(t.timesheet.allBreak) / 60, Number(this.currentAdditional ? this.currentAdditional : 0), savedAdditional || 0);
          t.timesheet.defaultTotal = 0;
          if (t.timesheet.subTotal) {
            t.timesheet.defaultTotal = Number(t.timesheet.subTotal) / 60;

          }
          t.editing = false;
        });
      });
    }
  };

  constructor(private eRef: ElementRef,
              private avatarService: AvatarService,
              private rosterService: RosterService,
              private formBuilder: FormBuilder,
              private accountService: AccountService) {
    this.signOnCheckbox = new FormControl(false);
    this.signOffCheckbox = new FormControl(false);
    this.breakCheckbox = new FormControl(false);
    this.additionalSubTotal = new FormControl('');
    this.additionalBreakControl = new FormControl('');
    this.commentControl = new FormControl('');
    this.subTotalSplitControl = new FormControl('');
    this.breakSplitControl = new FormControl('');
    this.additionalSubTotalControl = new FormControl('');
  }


  ngOnInit(): void {
    this.currentAccount = this.accountService.currentAccount.getValue();
    this.myGroup = new FormGroup({
      breakTimeForm: new FormControl(),
      splitTimeForm: new FormControl()
    });

    this.remainderSubTime <= -0.1 ? this.errorTotalSplit = true : this.errorTotalSplit = false;
    this.remainderBreakTime <= -0.1 ? this.errorTotalBreak = true : this.errorTotalBreak = false;

    this.defaultAvatar = this.avatarService.defaultAvatar;

    this.rows.forEach(() => {
      const formGroup = this.formBuilder.group({
        editingSplit: '',
        splitTimeForm: [0],
        breakTimeForm: [0],
        resultForm: [0],
      });
      this.tableForms.push(formGroup);
    });
  }

  getSplitStatus(task) {
    if((!task?.editing && !this.splitTimeEdit) && !this.editingAdditionalTime && task?.timesheet?.signon?.signature && task?.timesheet?.signoff?.signature) {
      return 'Finalised'
    } else if (!task?.editing && task?.resource?.release_status === 2 && !task?.timesheet?.signon?.signature) {
      return 'Unworked'
    } else if (!task?.editing && task?.resource?.release_status !== 2) {
      return 'Unaccepted'
    } else if (task?.editing == true) {
      this.getShiftStatus = 'In Progress'
    }
  }

  totalTimeValue(){
    let totalValue = 0;
    let breakTimeValue = 0;
    let splitTimeValue = 0;

    for (const formGroup of this.tableForms) {
      const breakTimeForm = formGroup.get('breakTimeForm');
      const splitTimeForm = formGroup.get('splitTimeForm');
      if (breakTimeForm) {
        const value = breakTimeForm.value;
        breakTimeValue += value
        totalValue -= value ? parseFloat(value) : 0;
      }
      if (splitTimeForm) {
        const value = splitTimeForm.value;
        splitTimeValue += value
        totalValue += value ? parseFloat(value) : 0;
      }
    }
    this.totalSplitTime = splitTimeValue;
    this.totalBreakTime = breakTimeValue;
    this.totalTime = totalValue.toFixed(1);
  }

  calculateTotalTime(formGroup: FormGroup) {
    const splitTime = formGroup.get('splitTimeForm').value;
    const breakTime = formGroup.get('breakTimeForm').value;
    const totalTime = splitTime - breakTime;
    this.totalTimeValue()
    return totalTime.toFixed(1);
  }
  // roundUpToFirstDecimal(value){
  //   if(value != undefined){
  //     let toFixedValue = value.toFixed(2)
  //     return Math.ceil(toFixedValue*10)/10;
  //   }else{
  //     console.log("value is undefined, timesheet-table-users.component.ts")
  //   }

  // }
  getResultValueFromFormGroup(formGroup:FormGroup){
    const formResult = formGroup.get('splitTimeForm').value;
  }

  selectResult(value: string, index: number, res, venue): void {
    let resultValue = this.countValue(value);

    switch(res) {
      case 'split':
        this.tableForms[index].get('resultForm').patchValue(resultValue);
        break;
      case 'edit':
        this.newSplits[index].result = resultValue;
        break;
      case 'remainder':
        this.remainderResult = resultValue;
        break;
      case 'itemCodeFirst':
        this.newSplits[index].item_code = venue.resource_rates[value].rates[0]
          .item_code;
        this.newSplits[index].charge_rate = venue.resource_rates[value].rates[0]
          .value;
        break;
      case 'itemCodeSecond':
        this.newSplits[index].item_code = venue.resource_rates[value].rates[1]
          .item_code;
        this.newSplits[index].charge_rate = venue.resource_rates[value].rates[1]
          .value;
        break;
      case 'itemCodeThird':
        this.newSplits[index].item_code = venue.resource_rates[value].rates[2]
          .item_code;
        this.newSplits[index].charge_rate = venue.resource_rates[value].rates[2]
          .value;
        break;
      case 'remainderItemCodeFirst':
        this.remainderItemCode = venue.resource_rates[value].rates[0]
          .item_code;
        this.remainderChargeRate = venue.resource_rates[value].rates[0]
          .value;
        break;
      case 'remainderItemCodeSecond':
        this.remainderItemCode = venue.resource_rates[value].rates[1]
          .item_code;
        this.remainderChargeRate = venue.resource_rates[value].rates[1]
          .value;
        break;
      case 'remainderItemCodeThird':
        this.remainderItemCode = venue.resource_rates[value].rates[2]
          .item_code
        this.remainderChargeRate = venue.resource_rates[value].rates[2]
          .value
        break;
    }
  }

  countValue(value) {
    switch (value) {
      case 'Billable':
        return 1;
      case 'Non billable':
        return 2;
      case 'Unresolved':
        return 0;
      default:
        return 0;
    }
  }

  // this.shiftRole = {
  //   resource_rate_id: this.currentRate?.uuid,
  //   name: this.addShiftRoleForm.get('nameShiftRole').value,
  //   rates: this.currentRate?.rates,
  //   description: this.addShiftRoleForm.get('description').value,
  //   credentials: [],
  //   accreditation_requirements: []
  // };
  getAllAmount(){
    // array of split time
    // array of additional time
  }

  updateItemCode(accountUUID, clientUUID, venueUUID, roleUUID, role){
    this.shiftRole = {
    item_code: role
    }
    this.accountService
    .updateClientVenueRole(accountUUID?.uuid, clientUUID.uuid, venueUUID.uuid, roleUUID.uuid, this.shiftRole)
  }

  changeResultMainTopRow(res, task, shift) {
    let resNum = this.countValue(res);
    //to show the change instantly
    task.timesheet.result = resNum;
    let inxTask = shift.venue.tasks.findIndex(t => t.uuid === task.uuid);
    //send the request to the actual server
      this.rosterService.updateSplitResult(task, resNum).subscribe(res => {
        task.timesheet = res;
        this.updateShifts(shift, inxTask, task);
      });

  }

  getResult(res, task?,  shift?) {

    let resNum = this.countValue(res);

    if (res !== 'Split time' && res !== 'Additional field') {
      task['resultMenu'] = res;
      if (res === 'Unresolved') {
        task.editing = true;
      } else {
        task.editing = false;
      }
      // this.rosterService.updateSplitResult(task?.uuid, resNum).pipe(
      //   takeUntil(this.unsubscribeAll),
      //   tap(res => {
      //     this.newField = false;
      //     // task?.timesheet?.splits.push(split);
      //     let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
      //     this.updateShifts(shift, idx, task);
      //     this.savedSplitTimes = true;
      //     this.currentSplit = null;
      //   })
      // ).subscribe();
      let ind = shift?.tasks.findIndex(t => t.uuid === task.uuid);
      this.updateShifts(shift, ind, task);
      this.newFieldResult = res;
    //   this.openedIndex = null;
    } else if (res === 'Edit') {

      this.validatorGuard()

      this.newField = true;
      this.savedSplitTimes = false;
      this.currentTaskUUID = task.uuid;
      this.currentshift = shift;
      this.subTotalSplitControl.reset();
      this.breakSplitControl.reset();
      task.editing = true;
      this.splitTimeEdit = true
      // this.getShiftStatus = true
      // this.editingAdditionalTime = true;
      this.newSplits = [];

      task?.timesheet?.splits.forEach(shift => {
        const newSplit = {
          subtotal: (shift.subtotal/60).toFixed(1),
          break: (shift.break/60).toFixed(1),
          result: shift.result,
          item_code: shift.item_code,
          charge_rate: shift.charge_rate,

        };
        this.newSplits.push(newSplit);
      });
    } else if (res === 'Split time') {
      this.newSplits = [{id: 1}]
      this.validatorGuard()

      this.newField = true;
      this.savedSplitTimes = false;
      this.currentTaskUUID = task.uuid;
      this.currentshift = shift;
      this.subTotalSplitControl.reset();
      this.breakSplitControl.reset();
      task.editing = true;
      this.splitTimeEdit = true

    } else if (res === 'Additional field') {
      this.additionalField = true;
      this.savedSplitTimes = false;
      this.currentTaskUUID = task.uuid;
      this.currentshift = shift;
      this.additionalSubTotalControl.reset();
      this.additionalBreakControl.reset();
      task.editing = true;
      this.editingAdditionalTime = true;
      this.isEditing=true;

    }
  }

  closePanel(idx, status) {
    this._shifts?.forEach(shift => {
      shift?.venue?.tasks?.forEach(t => {
        this.cancelSplitTime(t);
        this.cancelAdditionalField(t);
      });
    });
    if (status === 'client') {
      this.rosterService.openedClients = this.rosterService.openedClients.filter((c, i) => i !== idx);
    } else if (status === 'venue') {
      this.rosterService.openedVenues = this.rosterService.openedVenues.filter((v, i) => i !== idx);
    }
  }

createTable(res) {
  if (res === 'split') {
    const newId = this.rows[this.rows.length - 1].id + 1;
    this.rows.push({ id: newId });


    const formGroup = this.formBuilder.group({
      editingSplit: '',
      splitTimeForm: [0],
      breakTimeForm: [0],
      resultForm: [2],
    });
    this.tableForms.push(formGroup);

  } else if (res === 'edit') {
      const newSplit = {
        subtotal: 0,
        break: 0,
        result: 1
      };
      this.newSplits.push(newSplit);
   }
}

  validatorGuard(){
    this.remainderSubTime = -1;
    this.remainderBreakTime = -1;
    this.remainderTotalTime = -1;

    this.remainderSubTime <= -0.1 ? this.errorTotalSplit = true : this.errorTotalSplit = false;
    this.remainderBreakTime <= -0.1 ? this.errorTotalBreak = true : this.errorTotalBreak = false;
  }

  cancelTable(event: MouseEvent, index: number, status){
    this.validatorGuard();
    if (status === 'split') {
      event.stopPropagation();
      this.tableForms.splice(index, 1);
      this.rows.splice(index, 1);
    } else if(status === 'edit') {
      event.stopPropagation();
      this.newSplits.splice(index, 1);
    }
  }

  createTime(date, duration?) {
    if (duration) {
      return moment(date).add(duration, 'minutes').format('HH:mm');
    } else {
      return moment(date).format('HH:mm');
    }
  }

  openAccordionClient(idx, status) {
    if (status === 'client') {
      this.rosterService.openedClients.push(idx);
    } else if (status === 'venue') {
      this.rosterService.openedVenues.push(idx);
    }
  }

  acceptChallenge(shift, task, challenge) {
    let time;
    if (this.signOnCheckbox.value) {
      time = this.signOnCheckbox.value;
    }
    if (this.signOffCheckbox.value) {
      time = this.signOffCheckbox.value;
    }
    if (this.breakCheckbox.value) {
      time = this.breakCheckbox.value;
    }
    if (time) {
      this.rosterService.acceptChallenge(task?.uuid, challenge?.user?.uuid, time).pipe(
        takeUntil(this.unsubscribeAll),
        tap(res => {
          let ind = shift.tasks.findIndex(t => t.uuid === task.uuid);
          this.updateShifts(shift, ind, task);
        })
      ).subscribe();
    }
  }

  getStatus(status) {
    switch(status) {
      case Result.Unresolved:
        return 'Unresolved';
      case Result.Billable:
        return 'Billable';
      case Result.NonBillable:
        return 'Non Billable';
    }
  }

  isNaN(value: number): boolean {
    return Number.isNaN(value);
  }

  getFormatStringTime(minutes) {
    let value = minutes / 60;
    if (!Number.isInteger(value)) {
      return value.toFixed(1);
    }
    return value;
  }

  saveNewTime(shift, status, task, spl?, addit?) {
    if (status == 'edit') {

      //deleting all split times before storing new split times
      // task?.timesheet?.splits.forEach(shift=>{
      //   this.rosterService.deleteSplit(task?.uuid, shift?.uuid).subscribe()
      // })

      const newSplitTimes: any[] = [];
      this.newSplits.forEach((splits)=> {
        let valueBreak = splits.break;
        let subTotalValue = splits.subtotal;
        let shiftResult = splits.result
        let shiftItemCode = splits.item_code;
        if(splits.item_code == 0 || splits.item_code == null) {
          shiftItemCode = '0'
        }else {
          shiftItemCode = shiftItemCode.toString()
        }
        // shiftItemCode.toString()
        let shiftChargeRate = splits.charge_rate || 0;
        let newSplitBreak = this.convertToMinutes(valueBreak);
        let newSplitSubTotal = this.convertToMinutes(subTotalValue);
        if (newSplitBreak !== 0 || newSplitSubTotal !== 0) {
          let split = {
            break: newSplitBreak || 0,
            charge_rate: shiftChargeRate,
            item_code: shiftItemCode || '0',
            result: shiftResult || 1,
            subtotal: newSplitSubTotal || 0
          };
            newSplitTimes.push(split);
          }

      })
      let remainderSplitBreak = this.convertToMinutes(this.remainderBreakTime);
      let remainderSplitSubTotal = this.convertToMinutes(this.remainderSubTime);
      let remainderResultValue = this.remainderResult
      let remainderItemCodeValue = this.remainderItemCode.toString()
      let remainderChargeRate = this.remainderChargeRate
      if (remainderSplitSubTotal !== 0 || remainderSplitBreak !== 0) {
      let remainder = {
        subtotal: remainderSplitSubTotal,
        charge_rate: remainderChargeRate,
        item_code: remainderItemCodeValue,
        result: remainderResultValue,
        break: remainderSplitBreak
      }
        newSplitTimes.push(remainder);

    }

      // newSplitTimes.forEach((split) => {

      //     this.rosterService.addSplitTime(task?.uuid, split).pipe(
      //       takeUntil(this.unsubscribeAll),
      //       tap(res => {
      //         this.newField = false;
      //         task?.timesheet?.splits.push(split);
      //         let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
      //         this.updateShifts(shift, idx, task);
      //         this.savedSplitTimes = true;
      //         this.currentSplit = null;
      //         this.splitTimeEdit = false
      //       })
      //     ).subscribe();
      // })

      //push: to show the change instantly before pulling, template refers to this task.timesheet.splits
      task.timesheet.splits = [];
      newSplitTimes.forEach(res => {
        task?.timesheet?.splits.push(res);

      })
        this.rosterService.splitsReplace(task?.uuid, newSplitTimes).pipe(
            takeUntil(this.unsubscribeAll),
            tap(res => {
              this.newField = false;

              let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
              this.updateShifts(shift, idx, task);
              this.savedSplitTimes = true;
              this.currentSplit = null;
              this.splitTimeEdit = false
            })
          ).subscribe();
      // this.rosterService.splitsReplace(task?.uuid, newSplitTimes).subscribe()
    }

    if (status === 'split') {
      const splitTimes: any[] = [];

      this.tableForms.forEach((formGroup)=> {
        let valueBreak = formGroup.get('breakTimeForm').value;
        let subTotalValue = formGroup.get('splitTimeForm').value;
        let resultValue = formGroup.get('resultForm').value;
        let itemCodeValue = formGroup.get('resultForm').value;
        let newSplitBreak = this.convertToMinutes(valueBreak);
        let newSplitSubTotal = this.convertToMinutes(subTotalValue);

        if (newSplitBreak !== 0 || newSplitSubTotal !== 0) {
          let split = {
            break: newSplitBreak || 0,
            charge_rate: 0,
            item_code: task?.role?.item_code,
            result: resultValue,
            subtotal: newSplitSubTotal || 0
          };
          splitTimes.push(split);
        }
      })
      let remainderSplitBreak = this.convertToMinutes(this.remainderBreakTime);
      let remainderSplitSubTotal = this.convertToMinutes(this.remainderSubTime);
      let remainderResultValue = this.remainderResult
      if (remainderSplitSubTotal !== 0 || remainderSplitBreak !== 0) {
      let remainder = {
        subtotal: remainderSplitSubTotal,
        charge_rate: 0,
        item_code: task?.role?.item_code,
        result: remainderResultValue,
        break: remainderSplitBreak
      }
        splitTimes.push(remainder);
    }
      splitTimes.forEach((split) => {
        if (spl) {
          split['uuid'] = spl?.uuid;
          this.rosterService.updateSplits(task?.uuid, split['uuid'], split).pipe(
            takeUntil(this.unsubscribeAll),
            tap(res => {
              spl['editing'] = false;
              let i = task?.timesheet?.splits.findIndex(s => s.uuid === spl?.uuid);
              task?.timesheet?.splits.slice(i, 1, spl);
              let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
              this.updateShifts(shift, idx, task);
              this.savedSplitTimes = true;
              this.editingSplit = null;
            })
          ).subscribe();
        } else {
          this.rosterService.splitsReplace(task?.uuid, splitTimes).pipe(
            takeUntil(this.unsubscribeAll),
            tap(res => {
              this.newField = false;
              //push: to show the change instantly before pulling, template refers to this task.timesheet.splits
              task?.timesheet?.splits.push(split);
              let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
              this.updateShifts(shift, idx, task);
              this.savedSplitTimes = true;
              this.currentSplit = null;
            })
          ).subscribe();
          // this.rosterService.updateSplitResult(task?.uuid, 2).subscribe()
        }
      })

    } else if (status === 'additional') {
      let subTotalValue = this.additionalSubTotalControl.value;
      let valueBreak = this.additionalBreakControl.value;
      let newAdditionalBreak;
      let newAdditionalSubTotal;
      this.selectedAdditionalTime = -1;

      //break value can be 0
      if (!subTotalValue) {
        this.errorRequiredAdditional = true;
        return;
      } else {
        this.errorRequiredAdditional = false;
      }
      newAdditionalSubTotal = this.convertToMinutes(subTotalValue);
      if (valueBreak) {
        newAdditionalBreak = this.convertToMinutes(valueBreak);
      }
      let additional = {
        break: newAdditionalBreak || 0,
        charge_rate: this.remainderChargeRate,
        item_code: this.remainderItemCode.toString(),
        result: this.remainderResult,
        subtotal: newAdditionalSubTotal || 0
      };

      if (addit) {
        additional['uuid'] = addit.uuid;
        this.rosterService.updateAdditionalTime(task?.uuid, additional['uuid'], additional).pipe(
          takeUntil(this.unsubscribeAll),
          tap(res => {
            // addit = res;
            res['editing'] = false;
            let i = task?.timesheet?.additional_times.findIndex((a) => a.uuid === addit.uuid);
            task?.timesheet?.additional_times.splice(i, 1, res);
            let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
            this.updateShifts(shift, idx, task);
            this.savedAdditionalTimes = true;
            this.editingAdditional = null;
            this.isEditing=false;
          })
        ).subscribe();
      } else {
        this.rosterService.addAdditionalTime(task?.uuid, additional).pipe(
          takeUntil(this.unsubscribeAll),
          tap(res => {
            this.additionalField = false;
            task?.timesheet?.additional_times.push(additional);
            let idx = shift.tasks.findIndex((t) => t.uuid === task.uuid);
            this.updateShifts(shift, idx, task);
            this.savedAdditionalTimes = true;
            this.currentAdditional = null;
            this.isEditing=false;
          })
        ).subscribe();
      }
    }
    task.editing = false;
    this.splitTimeEdit = false
    this.editingAdditionalTime = false;
  }

  calculateSubTotal(task, signon, signoff) {
    if (task?.timesheet?.signon?.signature && task?.timesheet?.signoff?.signature) {
      return moment.duration(moment(signoff).diff(signon)).asMinutes();
    } else {
      return 0;
    }
  }

  isTaskPast(task) {
    return task?.timesheet?.signoff?.signature;
  }

  getBreak(task) {
    let allBreak = 0;
    if (task?.timesheet?.breaks && task?.timesheet?.breaks.length) {
      task.timesheet.breaks.forEach(breaks => {
        if (breaks.duration) {
          allBreak = allBreak + breaks.duration;
        }
      });
    }
    return allBreak;
  }

  convertToMinutes(value) {
    // the default value is an empty string, therefore it causes an error when break is 0, it is actually "" an empty string for the system
    if(value === "" || !value){
      value = 0;
    }
    if (Number.isInteger(value)) {
      return value * 60;
    } else {
      if (value && value.toString().split('.')[1].length === 1) {
        value = value.toString().split('.')[0] + '.' + value.toString().split('.')[1] + '0';
      }
      return ((value.toString().split('.')[1] * 60) / 100) + value.toString().split('.')[0] * 60;
    }
  }

  getSubtotal(task){
    let totalAmountOfAdditional = 0;
    let totalAmountOfSplit = 0;
    let totalCalculatedAmount;
    task?.timesheet.additional_times?.forEach(additional=>{
      totalAmountOfAdditional += additional?.subtotal
    })
    totalCalculatedAmount =  this.roundUpPipe.transform(totalAmountOfAdditional/60) + this.roundUpPipe.transform(task?.timesheet?.subTotal/60)
    return totalCalculatedAmount
  }

  getSubBreak(task){
    let totalAmountOfAdditional = 0;
    let totalAmountOfSplit = 0;
    let totalCalculatedAmount;
    task?.timesheet.additional_times?.forEach(additional => {
      totalAmountOfAdditional += additional?.break;
    })
    totalCalculatedAmount = this.roundUpPipe.transform(totalAmountOfAdditional/60) + this.roundUpPipe.transform(task?.timesheet?.allBreak/60)
    return totalCalculatedAmount;
  }

  getTotalAmount(task) {
    let totalAmountOfAdditional = 0;
    let totalAmountOfSplit = 0;
    let totalCurrentAmount = 0;
    let totalCalculatedAmount
    task?.timesheet.additional_times?.forEach(additional => {
      totalAmountOfAdditional += (additional?.subtotal- additional?.break ) * additional?.charge_rate
    });

    if (task?.timesheet.splits?.length >= 1) {
      task?.timesheet.splits?.forEach(split => {
        totalAmountOfSplit += (split?.subtotal - split?.break) * split?.charge_rate
      });
    } else {
      totalCurrentAmount += (this.roundUpPipe.transform((task?.timesheet?.subTotal|| 0) / 60) - this.roundUpPipe.transform((task?.timesheet?.allBreak || 0) / 60)) * (task?.role?.rates?.[0]?.value || 0)
    }

    totalCalculatedAmount = this.roundUpPipe.transform(totalAmountOfAdditional/60) + this.roundUpPipe.transform(totalAmountOfSplit/60) + totalCurrentAmount;
    return (totalCalculatedAmount);
  }

  changeTime(shift, type, task?,  statusForm?, index?, event?: any, controlName?: string, formGroup?: FormGroup) {
    let i = this._shifts.findIndex(s => s.uuid === task.uuid);
    this.shifts = this._shifts;
    shift.stopPropagation();
    shift.preventDefault()
    let subTotalTime;
    let breakTime;

    if (type === 'subTotalSplit' || type === 'breakSplit') {
      subTotalTime = this.subTotalSplitControl.value;
      breakTime = this.breakSplitControl.value;
      this.editingSplit = this.countTotalHours(Number(subTotalTime), Number(breakTime));
      let savedSplit = this.countSavedTimes(task?.timesheet?.splits);
      let sum = Number(savedSplit) + Number(this.editingSplit);

      this.remainderSubTime = Number(((this.roundUpPipe.transform(task?.timesheet?.subTotal/60)) - this.totalSplitTime).toFixed(1))
      this.remainderBreakTime = Number(((this.roundUpPipe.transform(task?.timesheet?.allBreak / 60)) - this.totalBreakTime).toFixed(1))

      this.remainderSubTime <= -0.1 ? this.errorTotalSplit = true : this.errorTotalSplit = false;
      this.remainderBreakTime <= -0.1 ? this.errorTotalBreak = true : this.errorTotalBreak = false;

      this.remainderTotalTime= Number((this.remainderSubTime - this.remainderBreakTime).toFixed(1))
    } else if(type === 'edit') {

      const subTotalTime = this.newSplits.reduce((sum, split) => sum + parseFloat(split.subtotal), 0);
      const breakTotalTime = this.newSplits.reduce((sum, split) => sum + parseFloat(split.break), 0);

      this.remainderSubTime = Number(((this.roundUpPipe.transform(task?.timesheet?.subTotal/60)) - subTotalTime).toFixed(1))
      this.remainderBreakTime = Number(((this.roundUpPipe.transform(task?.timesheet?.allBreak / 60)) - breakTotalTime).toFixed(1))

      // if(editItemCodeStatus==0)

      if (this.remainderSubTime <= -0.1 || Number.isNaN(this.remainderSubTime)) {
        this.errorTotalSplit = true;
      } else {
        this.errorTotalSplit = false;
      }
      if (this.remainderBreakTime <= -0.1 || Number.isNaN(this.remainderBreakTime)) {
        this.errorTotalBreak = true;
      } else {
        this.errorTotalBreak = false;
      }
      this.remainderTotalTime= Number((this.remainderSubTime - this.remainderBreakTime).toFixed(1))
    } else if (type === 'additionalSplitSubTotal' || type === 'splitBreak') {
      subTotalTime = this.additionalSubTotal.value;
      breakTime = this.additionalBreakControl.value;
      this.currentSplit = this.countTotalHours(subTotalTime, breakTime);
    } else if (type === 'splitTotalHours' || type === 'splitBreak') {
      subTotalTime = this.additionalSubTotal.value;
      breakTime = this.additionalBreakControl.value;
    } else if (type === 'additionalSubTotal' || type === 'additionalBreak') {
      subTotalTime = this.additionalSubTotalControl.value;
      breakTime = this.additionalBreakControl.value;
      if (statusForm === 'edit') {
        this.editingAdditional = this.countTotalHours(subTotalTime, parseFloat(breakTime));
        let savedAdditional = this.countSavedTimes(task?.timesheet?.additional_times, index);
        if (!task?.timesheet?.additional_times?.length || task?.timesheet?.additional_times?.length <= 1) {
          task.timesheet.total = task.timesheet.defaultTotal + Number(this.editingAdditional);
        } else {
          task.timesheet.total = task.timesheet.defaultTotal + savedAdditional + Number(this.editingAdditional);
        }
      } else {
        this.currentAdditional = this.countTotalHours(subTotalTime, breakTime);
        let savedAdditional = this.countSavedTimes(task?.timesheet?.additional_times);
        if (!task?.timesheet?.additional_times?.length || task?.timesheet?.additional_times?.length <= 1) {
          task.timesheet.total = task.timesheet.defaultTotal + Number(this.currentAdditional) + Number(savedAdditional);
        } else {
          task.timesheet.total = task.timesheet.defaultTotal + Number(this.currentAdditional) + Number(savedAdditional);
        }
      }
    }
  }


  countSavedTimes(array, i?) {
    let time = 0;
    if (array?.length) {
      array.forEach((t, inx) => {
        if (i !== inx) {
          time = time + (t.subtotal / 60 - t.break /60);
        }
      });
    }
    return time;
  }

  addComment(task) {
    this.commentControl.reset();
    this.commentStatus = 'create';
    this.uuidCreateComment = task.uuid;
  }

  cancelSplitTime(split) {
    this.rows = [0];
    this.newField = false;
    this.savedSplitTimes = true;
    this.editingSplit = 0;
    this.errorTotalSplit = false;
    this.errorRequiredSplit = false;
    split['editing'] = false;
    this.splitTimeEdit = false;
  }
  deleteTime(shift, task, split, index, status) {
    if (status === 'split') {
      this.rosterService.deleteSplit(task?.uuid, split?.uuid).pipe(
        takeUntil(this.unsubscribeAll),
        tap(res => {
          task.timesheet.splits = task.timesheet.splits.filter((s, idx) => idx !== index);
          let inxTask = shift.tasks.findIndex(t => t.uuid === task.uuid);
          this.updateShifts(shift, inxTask, task);
          this.cancelSplitTime(split);
        })
      ).subscribe();
    } else if (status === 'additional') {
      this.rosterService.deleteAdditionalTime(task?.uuid, split?.uuid).pipe(
        takeUntil(this.unsubscribeAll),
        tap(res => {
          task.timesheet.additional_times = task.timesheet.additional_times.filter((s, idx) => idx !== index);
          let inxTask = shift.tasks.findIndex(t => t.uuid === task.uuid);
          this.updateShifts(shift, inxTask, task);
          this.cancelAdditionalField(split);
        })
      ).subscribe();
    }
    else if (status === 'all'){
      this.cancelSplitTime(task);
      task?.timesheet?.splits.forEach(shift=>{
        this.rosterService.deleteSplit(task?.uuid, shift?.uuid).subscribe()
      })
      task.timesheet.splits.splice(0, task.timesheet.splits.length);
    }
  }

  closeComment(task) {
    this.uuidCreateComment = null;
    this.uuidOpenedComment = null;
  }

  submitComment(client, shift, task, value, ind?) {
    if (value) {
      let comment = {
        comment: value
      };
      this.rosterService.addCommentTask(task.uuid, comment).pipe(
        tap((res: any) => {
          task.openedComment = false;
          let notes = res.filter(n => !n.hidden);
          task.notes = notes;
          task.editing = false;
          this.uuidCreateComment = '';
          this.updateShifts(shift, ind, task);
        }),
        takeUntil(this.unsubscribeAll)
      ).subscribe();
    }
  }

  updateShifts(shift, ind, task) {
    shift.venue_uuid = shift.venue.uuid;
    [...shift.tasks].forEach(t => t.openedComment = null);
    shift.tasks[ind] = task;
    shift.venue.tasks[ind] = task;
    let i = this._shifts.findIndex(s => s.uuid === shift.uuid);
    this.updateShift(shift).pipe(
      tap(res => {
        this._shifts.splice(i, 1, shift);
        this.shifts = this._shifts;
      })
    ).subscribe();
  }

  updateShift(shift) {
    return this.rosterService.updateShift(this.currentAccount.uuid, shift);
  }

  showComment(shift, task) {
   this.uuidOpenedComment = task.uuid;
   this.commentStatus = 'edit';
  }

  cancelAdditionalField(additional?) {
    this.additionalField = false;
    this.currentAdditional = 0;
    this.errorRequiredAdditional = false;
    this.editingAdditionalTime = false;
    this.selectedAdditionalTime = -1;
    this.isEditing=false;
    additional['editing'] = false;
  }

  deleteComment(client, shift, task, comment) {
    this.rosterService.deleteCommentTask(task?.uuid, comment).pipe(
      takeUntil(this.unsubscribeAll),
      tap(res => {
        task['openedComment'] = false;
        comment['hidden'] = true;
        let inxTask = shift.tasks.findIndex(t => t.uuid === task.uuid);
        this.updateShifts(shift, inxTask, task);
      })
    ).subscribe();
  }

  showChallenges(task) {
    task['showChallenge'] = true;
  }

  validateAdditionalDates(startDate, endDate) {
    // if (moment(endDate).isBefore(moment(startDate))) {
      // this.additionalSignOnControl.setErrors({additionalError: true});
    // }
    // if (moment(endDate).isAfter(moment(startDate))) {
      // this.additionalSignOnControl.setErrors({signOnError: null});
    // }
    // let date1 = [moment(this.additionalSignOnDate), moment(this.additionalSignOffDate)];
    // let date2 = [moment(this.openedshift?.timesheet.signon.datetime), moment(this.openedshift?.timesheet.signoff.datetime)];

    // let range = moment().range(date2[0], date2[1]);
    // if (range.contains(date1[0]) || range.contains(date1[1])) {
      // this.additionalSignOnControl.setErrors({conflict: true});
      // this.additionalSignOffControl.setErrors({conflict: true});
    // } else {
      // this.additionalSignOnControl.setErrors({conflict: null});
      // this.additionalSignOffControl.setErrors({conflict: null});
    // }

    // if (range.overlaps(range2)) {
    //   if ((range2.contains(range) || range.contains(range2)) && !date1[0].isSame(date2[0])) {
    //     this.additionalSignOnControl.setErrors({conflict: true});
    //     this.additionalSignOffControl.setErrors({conflict: true});
    //   } else {
    //     this.additionalSignOnControl.setErrors({conflict: true});
    //     this.additionalSignOffControl.setErrors({conflict: true});
    //   }
    // } else {
    //   this.additionalSignOnControl.setErrors({conflict: null});
    //   this.additionalSignOffControl.setErrors({conflict: null});
    // }
  }

  countTotalHours(subTotalTime, breakTime) {
    // the value 0 on input gives an empty string ""
   if (!breakTime || typeof breakTime === 'string') {
      breakTime = 0;
    }
    let totalHours = 0;
    if (subTotalTime && !breakTime) {
      totalHours = subTotalTime;
    }
    if (subTotalTime && breakTime) {
      totalHours = subTotalTime - breakTime;
    }

    //when breakTime is 0 , it gives an error so I put a guard here breakTime>0
    if (!Number.isInteger(totalHours) && breakTime>0) {
      return totalHours.toFixed(2);
    }
    return totalHours;
  }

  getTotal(subtotal, breaks, additional, savedAdditional?) {
    return subtotal - breaks + additional + savedAdditional;
  }

  isViewCommentIcon(task) {
    return task.notes.some(n => !n.hidden);
  }

  openResources(shift) {
    this.viewResources = !this.viewResources;
    this.openedshift = shift;
  }

  selectCheckbox(value) {
    switch(value) {
      case 'signon':
        this.checkedSignon = !this.checkedSignon;
        break;
      case 'signoff':
        this.checkedSignoff = !this.checkedSignoff;
        break;
      case 'break':
        this.checkedBreak = !this.checkedBreak;
        break;
    }
  }

  editSplitTime(){
    this.splitTimeEdit = true
  }

  additionalEditStatusRemaining(split){

  }

  editAdditionalTime(split, status, task, i?, shift?) {
    // this.savedSplitTimes = true;
    this.savedAdditionalTimes = false;
    this.currentTaskUUID = task.uuid;
    this.currentshift = shift;
    split.editing = true;
    this.selectedAdditionalTime = i
    this.selectedAdditionalTimeShift = shift;
    this.isEditing = true
    // this.additionalEditStatusRemaining(split)

    this.editingAdditionalTime = true;
    let timeTotal = this.getFormatStringTime(split.subtotal);
    let timeBreak = this.getFormatStringTime(split.break);
    if (status === 'split') {
      this.editingSplit = this.getFormatStringTime(split?.subtotal - split?.break);
      this.subTotalSplitControl.patchValue(timeTotal);
      this.breakSplitControl.patchValue(timeBreak);
    } else if (status === 'additional') {
      this.editingAdditional = this.getFormatStringTime(split?.subtotal - split?.break);
      this.additionalSubTotalControl.patchValue(timeTotal);
      this.additionalBreakControl.patchValue(timeBreak);
      this.remainderItemCode = task?.timesheet?.additional_times[i]?.item_code

    }
    // task.editing = true;
    this.newFieldResult = this.getStatus(split.result);
  }

  countResources(venue) {
    let countValue = 0;
    if (!venue?.tasks) {
      return 0;
    }
    venue?.tasks.forEach(res=>{
     if((res?.timesheet?.signon?.signature && res?.timesheet?.signoff?.signature && res?.resource?.release_status == 2) || res?.resource?.release_status !== 2 || !res?.timesheet?.signon?.signature){
      countValue++
     }
    })
    return countValue;
  }

  getAmountClient_Venue(client) {
    let amount = 0;
    if (client?.tasks && client?.tasks.length) {
      client.tasks.forEach(t => {
        if (t.rates) {
          amount = amount + t.rates[0].value * (t.total_hours.split(':')[0]*60 + t.total_hours.split(':')[1])/60;
        }
      });
    }
    return amount;
  }

  getSplitTimeChargeRate(venue) {
    if (venue?.tasks) {
      if (venue.resource_rates && venue.resource_rates.length > 0 && venue.resource_rates[0].rates && venue.resource_rates[0].rates.length > 0) {
        return venue.resource_rates[0].rates[0].value
      } else {
        // console.log("None");
        return;
      }
    }
  }

  getTotalTime(venue, value){
    if (value == "amount") {
      let totalAllBreak = 0;
      let totalSubtotal = 0;
      let additionalTimeValue = 0;
      let subTimeValue = 0;
      let totalSplitValue = 0;
      let totalMainValue =0;
      let totalTaskValue = 0;

        //tasks
        if(venue?.tasks?.length >=1){
          venue?.tasks.forEach(res=>{
            //timesheets
            if(res?.resource?.release_status==2 && (res?.timesheet?.signon?.signature && res?.timesheet?.signoff?.signature)){

              if(res?.timesheet?.additional_times?.length >=1){
                res?.timesheet?.additional_times.forEach(res=>{
                  additionalTimeValue += (this.roundUpPipe.transform(res?.subtotal/60)- this.roundUpPipe.transform(res?.break/60) ) * res?.charge_rate
                })
                }

              if(res?.timesheet?.splits?.length >=1){
                res?.timesheet?.splits.forEach(res=>{
                  subTimeValue += (this.roundUpPipe.transform(res?.subtotal/60) - this.roundUpPipe.transform(res?.break/60)) * res?.charge_rate
                })
              }else{
                  totalAllBreak = this.roundUpPipe.transform(res?.timesheet?.allBreak / 60)
                  totalSubtotal = this.roundUpPipe.transform(res?.timesheet?.subTotal / 60)
                  //to do: item code and charge rate issue needs to be fixed and replace 30
                  const rates = res?.role?.rates;
                  const value = rates !== null ? rates[0]?.value : 0;
                  totalMainValue = (totalSubtotal - totalAllBreak) * (value !== null ? value : 0)
              }

             totalTaskValue += (additionalTimeValue + subTimeValue + totalMainValue)
              additionalTimeValue=0;
              subTimeValue=0;
              totalMainValue=0;

            }
          })
        }

      return totalTaskValue
    } else if (value == "time") {
      let totalAllBreak = 0;
      let totalSubtotal = 0;
      let additionalTimeValue = 0;
      let subTimeValue = 0;
      let totalSplitValue = 0;
      let totalMainValue =0;
      let totalTaskValue = 0;
        //tasks
        if(venue?.tasks?.length >=1){
          venue?.tasks.forEach(res=>{
            //timesheets
            if(res?.resource?.release_status==2 && (res?.timesheet?.signon?.signature && res?.timesheet?.signoff?.signature)){

              if(res?.timesheet?.additional_times?.length >=1){
                res?.timesheet?.additional_times.forEach(res=>{
                  additionalTimeValue += (this.roundUpPipe.transform(res?.subtotal/60)- this.roundUpPipe.transform(res?.break/60) )
                })
                }

              if(res?.timesheet?.splits?.length >=1){
                res?.timesheet?.splits.forEach(res=>{
                  subTimeValue += (this.roundUpPipe.transform(res?.subtotal/60) - this.roundUpPipe.transform(res?.break/60))
                })
              }else{
                  totalAllBreak = this.roundUpPipe.transform(res?.timesheet?.allBreak / 60)
                  totalSubtotal = this.roundUpPipe.transform(res?.timesheet?.subTotal / 60)
                  totalMainValue = (totalSubtotal - totalAllBreak)
              }

             totalTaskValue += (additionalTimeValue + subTimeValue + totalMainValue)
              additionalTimeValue=0;
              subTimeValue=0;
              totalMainValue=0;

            }
          })
        }

      return totalTaskValue;
    }
  }

  countHours(venue,value) {

    if (value == "time") {

      let totalAllBreak = 0;
      let totalSubtotal = 0;
      let calculatedValue = 0;
      let additionalTimeValue =0;
      let subTimeValue = 0;
      let totalMainValue = 0;

      if (venue?.venues) {
        venue?.venues?.forEach(res => {
          res?.tasks?.forEach(res => {
            if (res?.resource?.release_status==2 && (res?.timesheet?.signon?.signature && res?.timesheet?.signoff?.signature)) {

                      if (res?.timesheet?.additional_times?.length >= 1) {
                        res?.timesheet?.additional_times.forEach(res => {
                          additionalTimeValue += (this.roundUpPipe.transform(res?.subtotal/60)- this.roundUpPipe.transform(res?.break/60) );
                        });
                      }

                      if (res?.timesheet?.splits?.length >= 1) {
                        res?.timesheet?.splits.forEach(res=>{
                          subTimeValue += (this.roundUpPipe.transform(res?.subtotal/60) - this.roundUpPipe.transform(res?.break/60));
                        });
                      } else {
                        totalAllBreak = this.roundUpPipe.transform(res?.timesheet?.allBreak / 60);
                        totalSubtotal = this.roundUpPipe.transform(res?.timesheet?.subTotal / 60);
                        totalMainValue = (totalSubtotal - totalAllBreak);
                      }
                      calculatedValue += totalMainValue + (additionalTimeValue+subTimeValue);
                      additionalTimeValue = 0;
                      subTimeValue = 0;
                      totalMainValue = 0;
            }
          });
        });
        return calculatedValue;
      }
    } else if (value == "amount") {

      let totalAllBreak = 0;
      let totalSubtotal = 0;
      let calculatedValue = 0;
      let additionalTimeValue =0;
      let subTimeValue = 0;
      let totalMainValue = 0;

      if (venue?.venues) {
        venue?.venues?.forEach(res => {
          res?.tasks?.forEach(res => {
            if (res?.resource?.release_status==2 && (res?.timesheet?.signon?.signature && res?.timesheet?.signoff?.signature)) {

              if (res?.timesheet?.additional_times?.length >= 1) {
                res?.timesheet?.additional_times.forEach(res => {
                  additionalTimeValue += (this.roundUpPipe.transform(res?.subtotal/60)- this.roundUpPipe.transform(res?.break/60)) * res?.charge_rate
                });
              }

              if (res?.timesheet?.splits?.length >= 1) {
                res?.timesheet?.splits.forEach(res => {
                  subTimeValue += (this.roundUpPipe.transform(res?.subtotal/60) - this.roundUpPipe.transform(res?.break/60))* res?.charge_rate
                });
              } else {
                totalAllBreak = this.roundUpPipe.transform(res?.timesheet?.allBreak / 60);
                totalSubtotal = this.roundUpPipe.transform(res?.timesheet?.subTotal / 60);
                const rates = res?.role?.rates;
                const value = rates !== null ? rates[0]?.value : 0;
                totalMainValue = (totalSubtotal - totalAllBreak) * (value !== null ? value : 0);
              }
              calculatedValue += totalMainValue+(additionalTimeValue+subTimeValue);
              additionalTimeValue = 0;
              subTimeValue = 0;
              totalMainValue = 0;
            }
          })
        });
        return calculatedValue;
      }

    }
  }

  getAmount(rates, hours) {
    if (!rates || !hours) {
      return 0;
    }
    if (rates && rates.length) {
      return rates[0].value * hours.split(':')[0];
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
