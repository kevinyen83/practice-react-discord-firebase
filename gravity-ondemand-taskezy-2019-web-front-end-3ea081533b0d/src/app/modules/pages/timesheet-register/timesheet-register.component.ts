import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { tap, catchError, finalize, takeUntil } from 'rxjs/operators';
const moment = extendMoment(Moment);
import { EMPTY, Subject } from 'rxjs';
import { CalendarView } from 'angular-calendar';

import { fuseAnimations } from '@fuse/animations';
import { RosterService } from '../../../core/services/roster/roster.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from 'app/core/services/account/account.service';
import { ShiftActivityComponent } from './shift-activity/shift-activity.component';

const TAB_CLIENTS = 'TAB_CLIENTS';
const TAB_SUPPLIERS = 'TAB_SUPPLIERS';
@Component({
  selector: 'app-timesheet-register',
  templateUrl: './timesheet-register.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimesheetRegisterComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;

  displayedColumns: string[] = ['Clients', 'Venues', 'Resources', 'Total Hours', 'Amount $', 'Status'];
  tableColumns: any[] = [
    { name: 'Date', width: '156px' },
    { name: 'Resource Name', width: '225px' },
    { name: 'Status', width: '162px' },
    { name: 'Sign on', description: '(HH:MM)', width: '100px' },
    { name: 'Sign off', description: '(HH:MM)', width: '100px' },
    { name: 'Sub-total', description: '(Units)', width: '117px' },
    { name: 'Break', description: '(Units)', width: '110px' },
    { name: 'Total hours', description: '(Units)', width: '128px' },
    { name: 'Item code', width: '110px' },
    { name: 'Charge rate', description: '$/h', width: '118px' },
    { name: 'Amount', description: '$', width: '107px' },
    { name: 'Result', width: '157px' },
    { name: 'Last Edit', width: '150px' }
  ];

  // shiftColumns: string[] = ['name', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'total'];

  getShiftsMonth;
  getShiftsYear;
  getShiftsWeek;

  clientsForView = [];
  // view: string;
  viewSpinner = false;
  viewDate: Date = moment().startOf('d').toDate();
  activeDayIsOpen: boolean = true;
  // firstDayOfMonth;
  // endDayOfMonth;
  viewAngularCalendar: CalendarView = CalendarView.Week;
  // shiftColumnsTitle = [];
  // dataSource: MatTableDataSource<any>;
  shiftDataSource: MatTableDataSource<any>;
  unsubscribeAll = new Subject<any>();
  resources = [];
  uuid = '';
  shifts = [];
  currentAccount: any = {};
  // calendarOfWeek = [];
  startDate: any;
  endDate: any;
  // currentDate: any;
  selectedDate: any;
  // loadingFlag = true;
  registerForm: FormGroup;
  selectIndex = -1;
  changed = false;
  shiftTableData = [];
  // groupBy = 'Resource';
  activeTab = TAB_CLIENTS;
  // filteredShifts = [];
  // shiftsForView = [];
  // clientsForView = [];
  // suppliersForView = [];
  searchStr = '';

  @ViewChild('matDrawerShiftDetail') matDrawerShiftDetail;
  @ViewChild('matDrawerShiftFilter') matDrawerShiftFilter;

  constructor(private rosterService: RosterService, private formBuilder: FormBuilder, private accountService: AccountService, private dialog: MatDialog) {
    this.registerForm = this.formBuilder.group({
      groupBy: 'Resource'
    });
  }

  ngOnInit() {

    this.viewSpinner = true;
    this.accountService.currentAccount
      .pipe(
        tap((res) => {
          this.currentAccount = res;
          // if (this.currentAccount && this.currentAccount.clients) {
          //   this.clientsForView = [...this.currentAccount.clients, this.currentAccount];
          // }
          this.resources = this.currentAccount.resources;
          this.checkTab();
          this.initCalendar();
          this.dateChanged();
          // this.generateShiftData();
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll),

      )
      .subscribe();
  }

  viewDateString() {
    const viewDate = moment(this.viewDate);
    this.startDate = viewDate.startOf('isoWeek');
    this.endDate = viewDate.endOf('isoWeek');
    return viewDate.startOf('week').format('D ') + viewDate.endOf('week').format('- D MMMM YY');
  }

  dateChanged() {
    this.activeDayIsOpen = false;
    this.getShiftsYear = moment(this.viewDate).year();
    this.getShiftsMonth = moment(this.viewDate).month() + 1;
    this.getShiftsWeek = moment(this.viewDate).week();
    this.refreshShifts();
  }

  // getShiftsByView() {
  //   if (this.view == 'month') {
  //     return this.rosterService.getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, this.getShiftsYear, this.getShiftsMonth, null);
  //   } else if (this.view == 'week') {
  //     return this.rosterService.getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, this.getShiftsYear, null, this.getShiftsWeek);
  //   }
  // }

  refreshShifts() {
    // this.getShiftsByView()
    return this.rosterService
      .getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, {value: 'subscriber'},  this.getShiftsYear, null, this.getShiftsWeek)
      .pipe(
        tap((res) => {
          this.shifts = res;
        }),
        finalize(() => {
          this.generateShiftData();
        })
      )
      .subscribe();
  }

  gotoDate(event: any) {
    this.viewDate = moment(event).startOf('day').toDate();
  }

  handleActiveTab(tab, column) {
    this.activeTab = tab;
    // this.clientsForView = [];
    this.displayedColumns[0] = column;
    this.generateShiftData();
  }

  initCalendar() {
    this.selectedDate = moment();
    this.startDate = this.selectedDate.clone().startOf('isoWeek');
    this.endDate = this.selectedDate.clone().endOf('isoWeek');
  }

  // fetchShiftsByWeek(year, week) {
  //   if (this.currentAccount.uuid) {
  //     return this.rosterService.getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, year, null, week);
  //   }
  // }

  // prevWeek() {
  //   this.selectedDate = this.selectedDate.subtract(1, "week");
  //   this.startDate = this.selectedDate.clone().startOf("isoWeek");
  //   this.endDate = this.selectedDate.clone().endOf("isoWeek");
  //   this.currentDate = this.selectedDate.format();
  //   const year = this.selectedDate.isoWeekYear();
  //   const week = this.selectedDate.isoWeek();
  //   this.fetchShiftsByWeek(year, week);
  // }

  // nextWeek() {
  //   this.selectedDate = this.selectedDate.add(1, "week");
  //   this.startDate = this.selectedDate.clone().startOf("isoWeek");
  //   this.endDate = this.selectedDate.clone().endOf("isoWeek");
  //   this.currentDate = this.selectedDate.format();
  //   const year = this.selectedDate.isoWeekYear();
  //   const week = this.selectedDate.isoWeek();
  //   this.fetchShiftsByWeek(year, week);
  // }

  // setDate() {
  //   this.selectedDate = moment(this.currentDate);
  //   this.startDate = this.selectedDate.clone().startOf("isoWeek");
  //   this.endDate = this.selectedDate.clone().endOf("isoWeek");
  //   const year = this.selectedDate.isoWeekYear();
  //   const week = this.selectedDate.isoWeek();
  //   this.fetchShiftsByWeek(year, week);
  // }

  // handleDateNow() {
  //   this.selectedDate = moment();
  //   this.startDate = this.selectedDate.clone().startOf("isoWeek");
  //   this.endDate = this.selectedDate.clone().endOf("isoWeek");
  //   this.currentDate = this.selectedDate.format();
  //   const year = this.selectedDate.isoWeekYear();
  //   const week = this.selectedDate.isoWeek();
  //   this.fetchShiftsByWeek(year, week);
  // }

  toggleShiftDetail() {
    this.matDrawerShiftDetail.toggle();
  }

  toggleShiftFilter() {
    this.matDrawerShiftFilter.toggle();
  }

  changeDrawer(e) {
    // this.viewAddShift = true;
  }

  handleActivity() {
    const activityDialogRef = this.dialog.open(ShiftActivityComponent, {
      data: this.shifts
    });

    activityDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // handleShiftItem(row, index) {
  //   if (this.selectIndex === index) {
  //     this.selectIndex = -1;
  //   } else {
  //     this.selectIndex = index;
  //     for (let columnIndex = 1; columnIndex < 8; columnIndex++) {
  //       const cellData: any = this.shiftTableData[index][columnIndex].shifts;
  //       if (cellData && cellData.length > 0) {
  //         for (const cell of cellData) {
  //           if (cell && this.isEmpty(cell.datetime)) {
  //             const startHour = moment(cell.datetime).format('HH:mm');
  //             const endHour = moment(cell.datetime).clone().add(cell.duration, 'm').format('HH:mm');
  //             cell.timeDetail = `${startHour} - ${endHour}`;
  //             cell['signon'] = cell?.timesheet?.signon?.signature;
  //             cell['signoff'] = cell?.timesheet?.signoff?.signature;
  //           } else {
  //             cell.timeDetail = '0m';
  //             cell['signon'] = null;
  //             cell['signoff'] = null;
  //           }
  //         }
  //       }
  //     }
  //     this.shiftDataSource = new MatTableDataSource<any>(this.shiftTableData);
  //   }
  // }

  isEmpty(data) {
    if (data === null || data === undefined || data === '') {
      return false;
    } else {
      return true;
    }
  }

  generateShiftData() {
    // if (this.currentAccount?.clients) {
    //   this.viewSpinner = false;
    //   return;
    // }
    // this.filteredShifts = this.shifts?.filter((shift) =>
    //   moment(shift.datetime).isBetween(moment(this.startDate), moment(this.endDate))
    // );
    // let namesOfClients = [];
    // const clients = [];

    let select = this.checkTab();

    // this.shifts?.forEach(shift => {
    //   if (!namesOfClients.includes(shift[select].profile_name)) {
    //     namesOfClients.push(shift[select].profile_name);
    //     let client = {
    //       id: shift[select].profile_uuid,
    //       uuid: shift[select].profile_uuid,
    //       client: shift[select].profile_name,
    //       resources: [],
    //       venues: [],
    //       status: 'Finalised'
    //     }
    //     clients.push(client);
    //   }
    // });

    // this is for resource counter bug, cleaning up all the key value pairs before pushing new values
    this.clientsForView.forEach(res => {
      res.tasks = [];
      res.venues.forEach(res => {
        res.tasks = [];
      });
    })

    this.shifts?.forEach((shift) => {
      let client = this.clientsForView?.find((cl) => cl?.uuid === shift.client_uuid);
      let venue = shift.venue;
      let venueClient;

      if (venue && venue.uuid) {
        venueClient = client?.venues?.find(v => v.uuid === venue?.uuid);
        if (!venue?.tasks) {
          venue.tasks = [];
        }
        if (venueClient && !venueClient?.tasks) {
          venueClient.tasks = [];
        }
      }
      if (client && !client?.tasks || !client?.tasks?.length) {
        client['tasks'] = [];
      }


      shift?.tasks?.forEach((task) => {
        let subTotal = moment(task.timesheet.signoff.datetime).subtract(moment(task.timesheet?.signon?.datetime).format('HH:mm'));
        if (subTotal) {
          task.sub_total = moment(subTotal).format('HH:mm');
        }
        let startTime = moment(task?.datetime).set({
          hours: +task?.sub_total.split(':')[0],
          minutes: +task?.sub_total.split(':')[1]
        });
        let break1;
        if (task?.timesheet?.breaks?.length) {
          break1 = moment(task?.timesheet.breaks[0].datetime).format('HH:mm');
        }
        let diffTime;
        if (break1) {
          diffTime = startTime.subtract({
            hours: +break1?.split(':')[0],
            minutes: +break1?.split(':')[1]
          });
        }
        if (diffTime) {
          task.total_hours = moment(diffTime).format('HH:mm');
        } else if (task.sub_total) {
          task.total_hours = task.sub_total;
        } else {
          task.total_hours = '00:00';
        }
        let repeatVenueTask;
        if (venue && venue.uuid) {
          repeatVenueTask = this.returnUniqueTasks(venue.tasks, task);
        }
        let repeatClientTask = this.returnUniqueTasks(client.tasks, task);
        let repeatVenueClientTask;
        if (venueClient) {
          repeatVenueClientTask = this.returnUniqueTasks(venueClient?.tasks, task);
        }
        if (!repeatVenueTask && venue && venue.uuid) {
          venue?.tasks.push(task);
        }
        if (!repeatClientTask) {
          client?.tasks.push(task);
        }
        if (!repeatVenueClientTask && venueClient) {
          venueClient?.tasks.push(task);
        }
        let iVenue = client?.venues?.findIndex(v => v.uuid === venueClient?.uuid);
        if (iVenue !== -1) {
          client?.venues.splice(iVenue, 1, venueClient);
        }
      });

      venue.status = 'Finalised';
      let findedIndex = client.venues.findIndex(v => v.name === venue.name);
      if (venue && venue.uuid && findedIndex === -1) {
        client.venues.push(venue);
      }
      let i = this.clientsForView?.findIndex(c => c?.uuid === client?.uuid);
      if (i !== -1) {
        this.clientsForView.splice(i, 1, client);
      }
      this.viewSpinner = false;
      this.changed = false;
    });
  }

  returnUniqueTasks(array, task) {
    return array?.find(t => t.uuid === task.uuid)
  }

  checkTab() {
    let select;
    if (this.activeTab === 'TAB_CLIENTS') {
      select = 'client';
      if (this.currentAccount && this.currentAccount.clients) {
        this.clientsForView = [...this.currentAccount.clients, this.currentAccount];
      }
    } else if (this.activeTab === 'TAB_SUPPLIERS') {
      select = 'supplier';
      if (this.currentAccount && this.currentAccount.suppliers) {
        this.clientsForView = [...this.currentAccount.suppliers, this.currentAccount];
      }
    }
    return select;
  }

  handleFilter() {
    // this.groupBy = this.registerForm.get("groupBy").value;
    // this.generateShiftData();
  }

  // handleSearch(newVal) {
  //   this.searchStr = newVal;
  //TODO: this should be a pipe
  //   this.handleFilterShifts();
  // }

  // handleFilterShifts() {
  //   const searchedShifts = this.shifts.filter((shift) => {
  //     if (JSON.stringify(shift).toLowerCase().indexOf(this.searchStr) >= 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });

  //   this.shifts = searchedShifts;
  // }

  handleExportPDF() {}

  handleExportCSV() {}

  handleStatus(currentShift) {
    if (currentShift?.resource?.status === 0) {
      return {
        icon: 'alert-circle-outline',
        text: 'Pending',
        color: 'bg-amber-300 text-amber-500 py-1 px-3 rounded-full text-sm',
        progress: '30%',
        width: 'width: 30%'
      };
    } else if (currentShift?.resource?.status === 1) {
      if (this.isEmpty(currentShift?.timesheet?.signoff?.signature)) {
        return {
          icon: 'checkmark-circle-outline',
          text: 'Completed',
          color: 'bg-green-300 text-green-500 py-1 px-3 rounded-full text-sm',
          progress: '100%',
          width: 'width: 100%'
        };
      } else {
        return {
          icon: 'checkmark-circle-outline',
          text: 'Accepted',
          color: 'bg-blue-300 text-blue-500 py-1 px-3 rounded-full text-sm',
          progress: '50%',
          width: 'width: 30%'
        };
      }
    } else {
      return {
        icon: 'close-circle-outline',
        text: 'Declined',
        color: 'bg-red-300 text-red-500 py-1 px-3 rounded-full text-sm',
        progress: '100%',
        width: 'width: 30%'
      };
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
