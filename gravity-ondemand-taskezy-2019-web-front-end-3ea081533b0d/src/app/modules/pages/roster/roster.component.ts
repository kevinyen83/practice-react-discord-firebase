import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject, EMPTY, of, forkJoin, combineLatest } from 'rxjs';
import { switchMap, takeUntil, tap, catchError, finalize } from 'rxjs/operators';
import html2canvas from 'html2canvas';
import { MatDrawer } from '@angular/material/sidenav';

// import RRule from 'rrule';

import { fuseAnimations } from '@fuse/animations';
import { RosterService } from '../../../core/services/roster/roster.service';
import { ExcelService } from './excel.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { AccountService } from 'app/core/services/account/account.service';
import { CalendarService } from './calendar.service';
import { CalendarEvent, CalendarMonthViewDay, CalendarView, collapseAnimation } from 'angular-calendar';
import { ViewPeriod } from 'calendar-utils';
import { AppSettings } from 'app/settings/app-settings';
import { FuseConfirmationService } from '@fuse/services/confirmation';

export interface CalendarDate {
  mDate: any;
  selected?: boolean;
  today?: boolean;
}

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fuseAnimations,
    collapseAnimation
  ]
})
export class RosterComponent implements OnInit, OnDestroy {

  @ViewChild('matDrawerFilterRoster') matDrawerFilterRoster: MatDrawer;
  @ViewChild('matDrawerAddShift') matDrawerAddShift: MatDrawer;
  // @ViewChild('matDrawerMenu') matDrawerMenu: MatDrawer;
  @ViewChild('matDrawerEditShift') matDrawerEditShift: MatDrawer;
  @ViewChild('matDrawerShiftChangelog') matDrawerShiftChangelog: MatDrawer;
  @ViewChild('matDrawerShiftDetails') matDrawerShiftDetails: MatDrawer;
  @ViewChild('matDrawerShiftRelease') matDrawerShiftRelease: MatDrawer;

  refreshCalendar = new Subject<void>();

  addShiftData = {};

  viewAngularCalendar: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = moment().startOf('d').toDate();
  viewCheckboxes: boolean = false;

  headerRelease: string;

  viewButtonCopy: boolean = false;
  viewTransferButton: boolean = false;

  activeDayIsOpen: boolean = false;
  activeDay: Date;
  activeDayStatus: number;

  viewPeriod: ViewPeriod;
  isAllDay: boolean = false;
  eventsModel: any;

  currentShift;
  arrowIcon: string = 'arrow_drop_up';
  view: string;
  viewAs: FormControl;

  allShifts: FormControl;
  unassignedOnly: FormControl;
  declined: FormControl;
  pending: FormControl;
  viewSpinner = false;
  rosterForm: FormGroup;
  checkboxes: FormGroup;

  unsubscribeAll = new Subject();

  getShiftsMonth;
  getShiftsYear;
  getShiftsWeek;
  viewAddShift = false;
  viewEditShift = false;
  viewReleaseShifts = false;
  viewCopyReccuringShift = false;
  viewShiftDetails = false;

  shifts: any = [];
  filteredShifts: any = [];
  events: CalendarEvent[] = [];
  openDayEvents: CalendarEvent[] = [];

  currentShiftsForCopy = [];
  activeFilter;
  clients: any = [];
  suppliers = [];
  resources = [];
  venues = [];

  currentAccount: any;
  currentUser: any;
  currentShiftForCopy: any;

  shiftDown = false;

  chipsFilters = [];
  selectedFilters = {
    dateFrom: '',
    dateTo: '',
    status: [],
    venue: [],
    supplier: [],
    client: [],
    resource: []
  };
  filteredData: any;
  reserveSelectedFilters;
  shiftForSelect: any;
  viewSideBar = false;
  selectedDates = [];
  selectedShifts = [];
  reserveShifts = [];
  noFilters = true;
  noResults = false;
  currentDateForCopy: any;
  currentDateForTransfer: any;

  filters: any = {
    viewVenue: true,
    viewSupplier: true,
    viewClient: true,
    viewResource: true,
    viewStatus: true,
    viewDraft: true,
    supplier: [],
    client: [],
    resource: [],
    venue: [],
    status: [],
    dateFrom: '',
    dateTo: ''
  };
  selectedInterval = [];
  openedClients = [];
  openedVenues = [];
  selectedStatuses = [];
  filterCheckboxes: any = {};
  filtersNavBar: any = {};

  reserveClients = [];
  minDate: Date = moment().subtract(1, 'months').toDate();
  maxDate: Date = moment().add(1, 'months').toDate();
  viewMode = AppSettings.ROSTER_VIEW_MODE_PRIMARY;
  openedDays = [];
  connectedVenues = [];

  // venueShiftsMap: Map<string, any[]>;

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.shiftDown = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.shiftDown = false;
  }

  constructor(
    private rosterService: RosterService,
    private _fuseConfirmationService: FuseConfirmationService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private userProfileService: UserProfileService,
    private router: Router,
    private formBuilder: FormBuilder,
    public accountService: AccountService,
    private excelService: ExcelService,
    private calendarService: CalendarService,
    private snackBar: MatSnackBar
  ) {
    this.unassignedOnly = this.formBuilder.control('');
    this.declined = this.formBuilder.control('');
    this.pending = this.formBuilder.control('');
    this.view = 'week';
    this.viewAs = new FormControl(accountService.currentAccountIsSubscriber?'subscriber':'supplier');
  }

  ngOnInit() {
    this.viewSpinner = true;

    this.createCheckboxesForm();
    this.createRosterForm();
    this.accountService.currentAccount
      .pipe(
        switchMap((res) => {
          this.currentAccount = res;
          this.venues = this.currentAccount.venues;
          if (this.currentAccount.uuid) {

          this.resources = this.currentAccount.resources || [];

          if (this.currentAccount.suppliers.length > 0) {
            this.suppliers = [
              this.currentAccount,
              ...this.currentAccount.suppliers
            ];
          } else {
            [this.currentAccount];
          }
          const clients = [
            this.currentAccount,
            ...this.currentAccount.clients
          ];
          this.dateChanged();
          this.clients = [...clients];
          this.reserveClients = [this.currentAccount, ...this.currentAccount.clients];
          // this.clearClients(this.clients);
          this.accountService.getConnectedVenues(this.currentAccount?.uuid);
        }
          this.reserveSelectedFilters = { ...this.selectedFilters };
          return combineLatest([this.userProfileService.currentUser, this.accountService.connectedVenues]);
        }),
        tap((res: any) => {
          // this.openedClients = JSON.parse(localStorage.getItem('openedClient'));
          // this.openedVenues = JSON.parse(localStorage.getItem('openedVenue'));
          this.currentUser = res[0];
          this.connectedVenues = res[1];
          console.log('=======================', this.connectedVenues);
          this.viewSpinner = false;
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  changeShifts(e, isCheckbox) {
    this.filteredShifts = e?.shifts?.length ? e?.shifts : this.shifts;
    this.clients = e?.clients.length ? e?.clients : [];
    if (!e.shifts.length && Object.keys(this.rosterService.selectedNameResult).length) {
      this.filteredShifts = [];
    }
    let selectedStatuses = e?.statuses && e?.statuses.length ? e?.statuses : [];
    let selectedFilters = e?.filters && Object.keys(e?.filters).length ? e.filters : {};
    let isFilter = e?.filters ? Object.keys(e?.filters).some(f => e.filters[f].length) : false;
    let isStatus = e.statuses ? Object.keys(e?.statuses).some(f => e.statuses[f].length) : false;
    let newFilters = {
      shifts: this?.filteredShifts,
      clients: isFilter || isStatus ? this.clients : [...this.reserveClients]
    };


    if (isCheckbox && (selectedStatuses && selectedStatuses?.length) || Object.keys(this.rosterService.selectedNameResult).length) {
      this.filterCheckboxes = newFilters;
    } else if (isCheckbox && !selectedStatuses || !selectedStatuses.length) {
      this.filterCheckboxes = {};
    }
    if (!isCheckbox && Object.keys(selectedFilters).length) {
      let isFilter = Object.values(selectedFilters).some((v: any[]) => v && v.length);
      if (isFilter) {
        this.filtersNavBar = newFilters;
      } else {
        this.filtersNavBar = {};
      }
    }

    if (!Object.keys(this.filtersNavBar).length && !Object.keys(this.filterCheckboxes).length) {
      this.returnAll(newFilters);
    } else if (Object.keys(this.filtersNavBar).length && !Object.keys(this.filterCheckboxes).length) {
      this.clients = this.filtersNavBar?.clients;
      this.filterShifts(this.filtersNavBar?.shifts);
    } else if (!Object.keys(this.filtersNavBar).length && Object.keys(this.filterCheckboxes).length) {
      this.clients = this.filterCheckboxes?.clients;
      this.filterShifts(this.filterCheckboxes?.shifts);
    } else if (Object.keys(this.filtersNavBar).length && Object.keys(this.filterCheckboxes).length) {
      this.clients = Array.from(new Set([...this.filtersNavBar?.clients, ...this.filterCheckboxes?.clients]));
      this.filterShifts(Array.from(new Set ([...this.filterCheckboxes?.shifts])));
    } else {
      this.returnAll(newFilters);
    }
    this.processShifts();
  }

  filterShifts(array) {
    this.clients.forEach(client => {
      let sh = array.find(shift => client?.shifts?.some(s => s.uuid === shift.uuid));
      if (sh) {
        this.filteredShifts.push(sh);
      }
    });
  }

  returnAll(e) {
    this.clients = e.clients || [...this.reserveClients];
    this.filteredShifts = e.shifts || this.rosterService.allShifts;
  }

  clearClients(clients) {
    this.clients = clients.map((c) => {
      this.openedClients.includes(c.uuid) ? c.opened = true : c.opened = false;
      c.shifts = [];
      c.events = [];
      c.venues.forEach((v) => {
        this.openedVenues.includes(v.uuid) ? v.opened = true : v.opened = false;
        v.shifts = [];
        v.events = [];
      });
      return c;
    });
  }

  toggleContent(cl, status) {
    cl.opened = !cl.opened;
    if (cl.opened) {
      if (status === 'client') {
        if (!this.openedClients.includes(cl.uuid)) {
          this.openedClients.push(cl.uuid);
        }
      } else if (status === 'venue') {
        if (!this.openedVenues.includes(cl.uuid)) {
          this.openedVenues.push(cl.uuid);
        }
      }
    } else {
      if (status === 'client') {
        cl.venues.map(v => {
          if (this.openedVenues.includes(v.uuid)) {
            v.opened = false;
          }
        });
        this.openedVenues = [];
        this.openedClients = this.openedClients.filter(uuid => uuid !== cl.uuid);
      } else if (status === 'venue') {
        this.openedVenues = this.openedVenues.filter(uuid => uuid !== cl.uuid);
      }
    }
  }

  dateChanged() {
    this.viewSpinner = true;
    // this.activeDayIsOpen = false;
    this.getShiftsYear = moment(this.viewDate).year();
    this.getShiftsMonth = moment(this.viewDate).month() + 1;
    this.getShiftsWeek = moment(this.viewDate).week();
    this.refreshShifts();
  }

  // checkPaymentValid() {
  //   if (this.currentAccount?.payment_instruments) {
  //     return !this.currentAccount?.payment_instruments.some(p => p.valid);
  //   } else {
  //     return true;
  //   }
  // }

  getShiftsByView() {
    if (this.view == 'month') {
      return this.rosterService.getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, this.viewAs, this.getShiftsYear, this.getShiftsMonth, null);
    } else if (this.view == 'week') {
      return this.rosterService.getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, this.viewAs,  this.getShiftsYear, null, this.getShiftsWeek);
    }
  }

  refreshShifts() {
    this.getShiftsByView()
      .pipe(
        tap((res) => {
          this.shifts = res;
          this.reserveShifts = [...this.shifts];
          this.rosterService.allShifts = [...this.reserveShifts];
          if (localStorage.getItem('openedDay') && this.rosterService.shiftData) {
            this.activeDay = moment(localStorage.getItem('openedDay')).startOf('d').toDate();
            this.dayEventGroupClicked(this.rosterService.shiftData);
          }
          this.viewAsChanged(this.viewAs);
          this.applyFilters();
          this.viewSpinner = false;
        }),
        catchError((err) => {
          return EMPTY;
        }),
        finalize(() => {
          // this.processShifts();
        })
      )
      .subscribe();
  }

  processShifts() {
    //TODO: fix the 3 filtering methods to works efficiently
    // this.reserveShifts = [...this.shifts];
    let currShiftId;
    if (this.rosterService.currentShift.getValue()) {
      currShiftId = this.rosterService.currentShift.getValue()?.uuid;
    }
    if (currShiftId) {
      let currShift = this.shifts.find(s => s.uuid === currShiftId);
      this.rosterService.currentShift = currShift;
    }
    this.clearClients(this.clients);
    this.updateEvents();
  }

  changedCheckbox() {
    this.selectedStatuses = this.rosterService.selectedStatuses;
    let clients = [];
    let uniqIdsClients = [];
    let filters = this.Filters;
    let result = [...this.reserveShifts].filter(shift => filters.some(filter => filter(shift)));
    result.forEach(shift => {
      let client = this.reserveClients.find(cl => cl.uuid === shift.client_uuid);
      if (client) {
        if (!uniqIdsClients.includes(client.uuid)) {
          uniqIdsClients.push(client.uuid);
          clients.push(client);
        }
      }
    });
    if (!result.length && !Object.values(this.rosterService.selectedFilters)) {
      clients = [...this.reserveClients];
      result = [...this.reserveShifts];
    }
    this.filteredData = {shifts: result, clients: clients, statuses: this.selectedStatuses};
    this.rosterService.selectedShifts = this.filteredData;
    this.changeShifts(this.filteredData, true);

    // this.setFilters(result, clients);
  }

  private get Filters(): Array<any> {
    return this.selectedStatuses.map(status => {
      if (status === 'completed') {
        return (item) => {
          let res = item.tasks.some(t => t.timesheet?.signoff?.signature);
          if (res) {
            return {...item};
          }
        }
      }
      if (status === 'inProgress') {
        return (item) => {
          let res = item.tasks.some(t => t.timesheet?.signon?.signature && !t.timesheet?.signoff?.signature);
          if (res) {
            return {...item};
          }
        }
      }
      if (status === 'draft') {
        return (item) => {
          if (item.release_status === 0) {
            return {...item};
          }
        }
      }

      if (status === 'cancelled') {
        return (item) => {
          let res = item.tasks.some(t => t.resource.release_status === 3);
          if (res) {
            return {...item};
          }
        }
      }
    });
  }

  applyFilters() {
    if (this.rosterService.selectedFilters && Object.keys(this.rosterService.selectedFilters).length) {
      let filters = this.rosterService?.selectedFilters;
      this.changeFilter(filters);
    }
    if (this.rosterService.selectedShifts && Object.keys(this.rosterService.selectedShifts).length) {
      let newView = this.rosterService?.selectedShifts;
      this.changeShifts(newView, false);
    }
    if (this.rosterService.selectedStatuses && this.rosterService.selectedStatuses.length) {
      this.changedCheckbox();
    }
    if (Object.keys(this.rosterService.selectedNameResult).length) {
      let filters = this.rosterService.selectedNameResult;
      this.changeShifts(filters, false);
    }
  }

  selectShift(e) {
    e.selected = !e.selected;
    if (e.selected) {
      this.selectedShifts.push(e);
    } else {
      _.remove(this.selectedShifts, (shift) => shift.id === e.id);
    }
  }

  dayEventGroupClicked({ date, events, status }: { date: Date; events: CalendarEvent[]; status: number }): void {
    if (this.activeDay && (!status || status == this.activeDayStatus) && moment(this.activeDay).isSame(date, 'day')
      && this.activeDayIsOpen === true) {
      // this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.activeDayStatus = status;
    this.activeDay = moment(date).startOf('d').toDate();
    this.openDayEvents = events;
  }

  openReleaseRoster() {
    this.viewReleaseShifts = true;
    this.headerRelease = this.viewDateString();
    // this.matDrawerShiftDescription.toggle();
    this.matDrawerShiftRelease.toggle();
  }

  openEventDetails(event) {
    if (this.matDrawerShiftDetails.opened && event.id === this.rosterService._currentShift.getValue().uuid) {
      this.matDrawerShiftDetails.close();
    } else if (!this.matDrawerShiftDetails.opened) {
      this.matDrawerShiftDetails.open();
    }
    this.rosterService.currentShift = event.rawShift;
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    // this.events = this.events.filter((event) => event !== eventToDelete);
    // delete event then get the lis of events again, cant just remove it from the list.
    // need tomake sure it was removed sucessfully first.
  }

  changeDrawer(e) {
    this.viewAddShift = true;
  }

  changeEditDrawer() {
    this.viewEditShift = true;
  }

  openedDescription() {
    this.viewShiftDetails = true;
  }


  updateEvents() {
    let events = [];


    if (this.clients && this.clients.length) {
      events = this.filteredShifts.map((shift) => {

        shift.resource_status = 0;
        shift.supplier_status = 0;

        shift.tasks.forEach((task) => {
          if (task?.resource?.release_status != 2 && shift?.resource_status < task?.resource?.release_status) {
            shift.resource_status = task.resource.release_status;
          }
          if (task.supplier.release_status != 2 && shift.supplier_status < task.supplier.release_status) {
            shift.supplier_status = task.supplier.release_status;
          }
        });

        let item: any = {
          start: Moment(shift.datetime).toDate(),
          end: Moment(shift.datetime).add(shift.duration, 'm').toDate(),
          allDay: true,
          isAllDay: true,
          venue: shift.venue,
          release_status: shift.release_status,
          color: this.shiftColour(shift),
          leftBorderColor: this.shiftBorderColour(shift),
          display: 'auto',
          draggable: false,
          id: shift.uuid,
          selected: this.selectedShifts.filter((sh) => sh.id == shift.uuid).length > 0,
          rawShift: shift
        };

        let client = this.clients.find((cl) => cl.uuid === shift?.client_uuid) || this.clients.find(cl =>
          (this.viewAs.value === 'supplier' ?
            shift.tasks.some(t => t.supplier.uuid === cl.uuid) : false));


        if (client) {
          let cShiftInd = client.shifts.findIndex((cls) => cls.uuid == shift.uuid);
          if (cShiftInd != -1) {
            client.shifts[cShiftInd] = shift;
            client.events[cShiftInd] = item;
          } else {
            client.shifts.push(shift);
            client.events.push(item);
          }


          let venue = client.venues.find((v) => v.uuid == shift.venue.uuid);
          if (venue) {
            let vShiftInd = venue.shifts.findIndex((vs) => vs.uuid == shift.uuid);
            if (vShiftInd != -1) {
              venue.shifts[vShiftInd] = shift;
              venue.events[vShiftInd] = item;
            } else {
              venue.shifts.push(shift);
              venue.events.push(item);
            }
          } else if (shift?.venue?.uuid) {
            venue = shift.venue;
            venue['shifts'] = [shift];
            venue['events'] = [item];
            client.venues.push(venue);
          }
          let idxVenue = client.venues.findIndex(v => v.uuid === shift.venue.uuid);
          if (idxVenue !== -1) {
            client.venues.splice(idxVenue, 1, venue);
          }
          let idxClient = this.clients.findIndex(c => c.uuid === shift?.client_uuid && this.clients.every(cl => cl.uuid !== shift?.client_uuid));
          if (idxClient !== -1) {
            this.clients.splice(idxClient, 1, client);
          }
        }

        return item;
      });
      if (!_.isEqual(this.rosterService.events, events)) {
        this.rosterService.events = events;
        this.events = this.rosterService.events;
      }
      this.refreshCalendar.next();
    }
  }

  shiftBorderColour(shift) {
    //this is a seperate function as the class names need to be defined for tailwind to generate them
    //dynamic classes, while they work, dont get generated by the library if they arn't first defined somewhere as
    // a full string.
    let declinedTask = shift?.tasks.some(t => t?.supplier?.release_status === 3 || t?.resource?.release_status === 3);
    let acceptedTasks = shift?.tasks.every(t => t.supplier?.release_status === 2 && t?.resource.release_status === 2 && shift.release_status === 3);
    let draftShift = shift.release_status === 0;
    if (draftShift) {
      //draft
      return 'border-l-zinc-400';
    } else if (acceptedTasks) {
      //all accepted
      return 'border-l-success';
    } else if (declinedTask) {
      //someone declined
      return 'border-l-danger';
    } else if (shift.release_status > 0) {
      //someone still pending
      return 'border-l-warning';
    }
  }

  shiftColour(shift) {
    if (shift.release_status === 0) {
      //draft
      return 'zinc-400';
    } else if (shift.release_status === 3 && shift.supplier_status === 2 && shift.resource_status === 2) {
      //all accepted
      return 'success';
    } else if (shift.release_status === 3 && (shift.supplier_status === 3 || shift.resource_status === 3)) {
      //someone declined
      return 'danger';
    } else if (shift.release_status > 0) {
      //someone still pending
      return 'warning';
    }

    //TODO: these status' need to be checked form resource.release_status and supplier.release_status in each task inside the shift.
    //TODO: client_release_status needs to be added
    //TODO: draft == not released to client.
    //TODO: need to update cell templates to read teh correct values too
    // return "8px solid " + this.statusColor('draft');
  }

  clearFilters() {
    this.selectedFilters = this.reserveSelectedFilters;
    this.rosterForm.get('clientsWithNoShifts').patchValue(false);
    this.rosterForm.get('supplier').patchValue('');
    this.rosterForm.get('client').patchValue('');
    this.rosterForm.get('resource').patchValue('');
    this.unassignedOnly.patchValue(false);
    this.declined.patchValue(false);
    this.pending.patchValue(false);
  }

  checkSelectedFilters() {
    let res = null;
    res = _.some(this.selectedFilters, (value, key) => {
      if (key !== 'allShifts' && key !== 'clientsWithNoShifts') {
        if (Array.isArray(value) && value.length) {
          return true;
        }
        if (!Array.isArray(value) && value !== undefined && value) {
          return true;
        }
      }
    });
    if (res) {
      this.selectedFilters['allShifts'] = false;
    }
    if (res === false) {
      this.selectedFilters['allShifts'] = true;
    }
  }

  changeFilter(event) {
    this.selectedFilters = event;
    const chips = [];

    for (let e in this.selectedFilters) {
      if (e) {
        if (this.selectedFilters[e] && Array.isArray(this.selectedFilters[e]) && this.selectedFilters[e].length) {
          switch(e) {
            case 'venue':
              let venues = this.venues.filter(v => this.selectedFilters[e].includes(v.uuid));
              if (venues && venues.length) {
                venues.forEach(v => {
                  chips.push(v.name);
                });
              }
              break;
            case 'client':
              let clients = this.clients.filter(c => this.selectedFilters[e].includes(c.uuid));
              if (clients && clients.length) {
                clients.forEach(c => {
                  chips.push(c.detail.name);
                });
              }
              break;
            case 'supplier':
              let suppliers = this.suppliers.filter(s => this.selectedFilters[e].includes(s.uuid));
              if (suppliers && suppliers.length) {
                suppliers.forEach(s => {
                  chips.push(s.detail.name);
                });
              }
              break;
            case 'resource':
              let resources = this.resources.filter(r => this.selectedFilters[e].includes(r.user_id));
              if (resources && resources.length) {
                resources.forEach(r => {
                  chips.push(r.name);
                });
              }
              break;
            case 'status':
              this.selectedFilters[e].forEach(s => {
                chips.push(s);
              });
              break;
          }
        }
      }
    }
    this.chipsFilters = chips;
  }

  deleteFilter(filter): void {
    this.chipsFilters = this.chipsFilters.filter(c => c.toString() !== filter.toString());
    this.rosterService.changedFilter.next({ key: filter });
  }

  clearAll() {
    this.chipsFilters = null;
    this.rosterService.changedFilter.next({ key: '' });
  }

  getSnackBar(message) {
    this.snackBar.open(`${message}`, 'X', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
    // this.viewButtonDelete = false;
  }

  closeSideNav(status) {
    if (status === 'edit') {
      this.viewEditShift = false;
      this.matDrawerEditShift.toggle();
      this.matDrawerShiftDetails.toggle();
      this.refreshShifts();
    } else if (status === 'add') {
      this.viewAddShift = false;
      this.matDrawerAddShift.toggle();
      this.refreshShifts();
    } else if (status === 'details') {
      this.viewShiftDetails = false;
      this.matDrawerShiftDetails.toggle();
      this.refreshShifts();
    } else if (status === 'release') {
      this.viewReleaseShifts = false;
      this.matDrawerShiftRelease.toggle();
      this.refreshShifts();
    } else if (status === 'changelog') {
      this.matDrawerShiftChangelog.toggle();
      this.refreshShifts();
    } else if (status === 'filter') {
      this.matDrawerFilterRoster.toggle();
    }
    this.clearClients(this.clients);
    // this.updateEvents();
    // this.shiftsForWeek();
  }

  onChangeFilter(filter: string, event) {
    this.activeFilter = event.value;
    this.selectedFilters[filter] = event.value;
    if (!event.value.length) {
      this.checkSelectedFilters();
    }
    localStorage.setItem('filterRoster', JSON.stringify(this.selectedFilters));
  }

  onChangeCheckbox(filter: string, event) {
    this.activeFilter = filter;
    this.selectedFilters[filter] = event.checked;
    localStorage.setItem('filterRoster', JSON.stringify(this.selectedFilters));
  }

  createCheckboxesForm() {
    this.checkboxes = new FormGroup({
      checkboxSupplier: new FormControl(true),
      checkboxClient: new FormControl(true),
      checkboxResource: new FormControl(true)
    });
  }

  openingChangelog() {
    this.matDrawerShiftChangelog.toggle();
  }

  clearSelected() {
    this.selectedShifts = [];
  }
  pasteSelected() {}

  showReleaseOnContext(shift) {
    return moment(shift.datetime).isBefore(moment()) && shift.release_status < 3;
  }

  releaseSelected() {
    this.releaseShifts(this.selectedShifts.map((selected) => selected.rawShift));
  }

  releaseClientShifts(client) {
    const clientShifts = [];
    // get the shifts from the client
    client.shifts.forEach((shift) => {
      if (moment(shift.datetime).isSame(this.viewDate, 'week')) {
        clientShifts.push(shift);
      }
    });
    this.releaseShifts(clientShifts);
  }

  releaseVenueShifts(venue) {
    const venueShifts = [];
    // get the shifts from the venue
    venue.shifts.forEach((shift) => {
      if (moment(shift.datetime).isSame(this.viewDate, 'week')) {
        venueShifts.push(shift);
      }
    });
    this.releaseShifts(venueShifts);
  }

  releaseShifts(shiftArr) {
    const releaseShifts$ = [];
    let alreadyReleased = 0;
    let pastShift = 0;

    if (shiftArr.length == 0) {
      const dialogRef = this._fuseConfirmationService.open({
        title: 'Release Results',
        message: 'No valid shifts to release.',
        icon: {
          show: true,
          name: 'heroicons_outline:exclamation',
          color: 'warning'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Ok',
            color: 'primary'
          },
          cancel: {
            show: false,
            label: 'Cancel'
          }
        },
        dismissible: false
      });
      return;
    }

    shiftArr.forEach((shift) => {
      if (moment(shift.datetime).isBefore(moment())) {
        pastShift++;
      } else {
        if (shift.release_status < 3) {
          releaseShifts$.push(this.releaseShift(shift));
        } else {
          alreadyReleased++;
        }
      }
    });

    if (releaseShifts$.length == 0) {
      let message = '';

      if (alreadyReleased > 0) {
        message += '<br>' + alreadyReleased + ' Shifts already fully released.';
      }

      if (pastShift > 0) {
        message += '<br>' + pastShift + ' Shifts in the past can not be released.';
      }

      const dialogRef = this._fuseConfirmationService.open({
        title: 'Release Results',
        message: message,
        icon: {
          show: true,
          name: 'heroicons_outline:exclamation',
          color: 'warning'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Ok',
            color: 'primary'
          },
          cancel: {
            show: false,
            label: 'Cancel'
          }
        },
        dismissible: false
      });
    }

    forkJoin(releaseShifts$).subscribe({
      next: (res: any) => {
        //TODO: sort out the failures from the successes and display a report of success/failure
        let success = 0;
        let failed = [];
        res.forEach((r) => {
          if (r.ok === false) {
            failed.push(r);
          } else {
            success++;
          }
        });
        let message = '';

        if (success > 0) {
          message += success + ' Shifts released.';
        }

        if (failed.length > 0) {
          message += '<br>' + failed.length + ' Shifts failed to release.';
        }

        if (alreadyReleased > 0) {
          message += '<br>' + alreadyReleased + ' Shifts already fully released.';
        }

        if (pastShift > 0) {
          message += '<br>' + pastShift + ' Shifts in the past can not be released.';
        }

        const dialogRef = this._fuseConfirmationService.open({
          title: 'Release Results',
          message: message,
          icon: {
            show: true,
            name: failed.length == 0 ? 'heroicons_outline:check' : 'heroicons_outline:exclamation',
            color: failed.length == 0 ? 'success' : failed.length == res.length ? 'warn' : 'warning'
          },
          actions: {
            confirm: {
              show: true,
              label: 'Ok',
              color: 'primary'
            },
            cancel: {
              show: false,
              label: 'Cancel'
            }
          },
          dismissible: false
        });
      },
      complete: () => {
        this.refreshShifts();
        this.clearSelected();
      }
    });
  }

  releaseSingleShift(shift) {
    this.releaseShift(shift).subscribe((res) => {
      if (res.ok === false) {
        const dialogRef = this._fuseConfirmationService.open({
          title: 'Release Failed',
          message: 'Failed to release the shift.<br>Reason: ' + res.message,
          icon: {
            show: true,
            name: 'heroicons_outline:exclamation',
            color: 'warn'
          },
          actions: {
            confirm: {
              show: true,
              label: 'Ok',
              color: 'primary'
            },
            cancel: {
              show: false,
              label: 'Cancel'
            }
          },
          dismissible: false
        });
      } else {
        this.rosterService.currentShift = res;
        this.refreshShifts();
      }
    });
  }

  releaseShift(shift) {
    return this.rosterService.releaseShift(shift).pipe(
      // takeUntil(this.unsubsc/ribeAll),
      catchError((err) => {
        console.log(err);
        return of({ shift, ok: false, reason: err.message });
      })
    );
  }

  addShift(shiftData): void {

    // if (day && client) {
    //   this.addShiftData = { day, client, venue };
    //   // this.rosterService._clickedClient.next(client);
    // } else {
    this.addShiftData = shiftData;
    // }
    this.viewAddShift = true;
    this.matDrawerAddShift.toggle();
  }

  toCurrentClient(client) {
    this.rosterService.toCurrentClient(client.uuid);
  }

  toCurrentSupplier(supplier) {
    this.rosterService.toCurrentSupplier(supplier.uuid);
  }

  toCurrentResource(resource) {
    this.rosterService.toCurrentResource(resource.uuid);
  }

  deleteShift(shift): void {
    // this.viewButtonDelete = true;
    if (shift && shift.release_status > 0 && moment(shift.datetime).isBefore(moment())) {
      this.getSnackBar('Impossible to cancel a released shift in the past');
      return;
    } else {
      this.putDeleteShift(shift);
    }
  }

  putDeleteShift(shift) {
    if (shift) {
      let msg = shift.release_status == 0 ? 'Delete' : 'Cancel';
      const dialogRef = this._fuseConfirmationService.open({
        title: 'Confirmation',
        message: msg + ' this shift?',
        actions: {
          confirm: {
            show: true,
            label: 'Yes',
            color: 'primary'
          },
          cancel: {
            show: true,
            label: 'No'
          }
        }
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res && res === 'confirmed') {
          this.rosterService
            .deleteShift(this.currentAccount.uuid, shift)
            .pipe(
              catchError((err) => {
                console.log(err);
                return EMPTY;
              })
              // takeUntil(this.unsubscribeAll)
            )
            .subscribe((res) => {
              this.events = this.events.filter((ev) => ev.id !== shift.uuid);
              this.refreshCalendar.next();
              this.refreshShifts();
              //TODO: for some reason the thing doesnt update the events liston the calendar after deleing the shift and refreshing.
              // this.matDrawerShiftDetails.close();
              // this.calendarOfWeeks = [];
              // this.shiftsForWeek();
            });
        }
      });
    }

    if (!shift) {
      this.getSnackNothing();
    }
  }

  getSnackNothing() {
    this.getSnackBar('Nothing Selected');
  }

  clearSelectedItems(e) {
    this.selectedShifts.forEach((shift) => {
      shift.selected = false;
    });
    this.selectedShifts = [];
  }

  editShift(shift) {
    if (shift.release_status > 0 && moment(shift.datetime).isBefore(moment())) {
      this.snackBar.open('Old shifts can not be edited', 'X', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }
    this.rosterService.currentShift = shift;
    this.currentShift = shift;
    this.viewEditShift = true;
    this.matDrawerEditShift.toggle();
  }

  openFilters() {
    this.reserveClients = this.clients;
    this.matDrawerFilterRoster.toggle();
  }

  __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
  }

  getNotification() {
    this.getSnackBar('You cannot move shifts to the past!');
  }

  htmlToCSV(client) {
    const csvContent = 'data:text/csv;charset=utf-8,' + client.shifts.map((e) => JSON.stringify(e)).join('\n');
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  isToday(date: any): boolean {
    return moment().isSame(moment(date), 'day');
  }

  createRosterForm(): FormGroup {
    return (this.rosterForm = new FormGroup({
      ['groupBy']: new FormControl(''),
      ['supplier']: new FormControl(''),
      ['searchSupplier']: new FormControl(''),
      ['clientsWithNoShifts']: new FormControl(false),
      ['client']: new FormControl(''),
      ['searchClient']: new FormControl(''),
      ['resource']: new FormControl(''),
      ['searchResource']: new FormControl(''),
      ['year']: new FormControl(''),
      ['week']: new FormControl(''),
      ['day']: new FormControl(''),
      ['notes']: new FormControl(false),
      ['clashes']: new FormControl(false),
      ['confirmed']: new FormControl(false),
      ['unconfirmed']: new FormControl(false),
      ['tbc']: new FormControl(false),
      ['complianceIssues']: new FormControl(false),
      ['recurring']: new FormControl(false),
      ['nonrecurring']: new FormControl(false)
    }));
  }

  htmlToPDF(index) {
    html2canvas(document.querySelector(`#client-container-${index}`)).then((canvas) => {
      // if (canvas.height > 0 && canvas.width > 0) {
      //   const pdf = new jsPDF('px', 'pt', [canvas.width + 1000, canvas.height]);
      //
      //   const imgData  = canvas.toDataURL('image/jpeg', 1.0);
      //   const width = pdf.internal.pageSize.getWidth();
      //   const height = canvas.height * width / canvas.width;
      //   pdf.addImage(imgData, 0, 0, width, height);
      //   pdf.save('roster_' + moment(this.viewDate).format() + '.pdf');
      // }
    });
  }

  htmlToXLS(client) {
    this.excelService.exportAsExcelFile(client.shifts, client.name);
  }

  filterArrayMulti(array, filteredArray, control) {
    if (!array) {
      return;
    }

    let search = this.rosterForm.get(control).value;
    if (!search) {
      filteredArray.next([...array]);
      return;
    } else {
      search = search.toLowerCase();
    }
    filteredArray.next(array.filter((item) => item.detail.name.toLowerCase().indexOf(search) > -1));
  }

  viewDateString() {
    const viewDate = moment(this.viewDate);
    switch (this.view) {
      case 'list':
      case 'week':
        return viewDate.startOf('week').format('D ')
          + viewDate.endOf('week').format('- D MMMM YY');
      case 'month':
        return viewDate.format('MMMM y');
      case 'day':
        return viewDate.format('D MMMM YY');
    }
  }

  viewChanged(viewChangeEvent) {
    switch (viewChangeEvent.value) {
      case 'list':
      case 'week':
        this.viewAngularCalendar = CalendarView.Week;
        break;
      case 'month':
        this.viewAngularCalendar = CalendarView.Month;
        if (localStorage.getItem('openedDay') && this.rosterService.shiftData) {
          this.activeDay = moment(localStorage.getItem('openedDay')).startOf('d').toDate();
          // this.activeDayIsOpen = true;
          this.dayEventGroupClicked(this.rosterService.shiftData);
        }
        break;
      case 'day':
        this.viewAngularCalendar = CalendarView.Day;
        break;
    }
  }

  viewAsChanged(event) {
    this.clients = [...this.reserveClients];
    let currentShifts = [];
    let currentClients = [];
    switch (event.value) {
      case 'subscriber':
        currentShifts = this.rosterService.selectedShifts['shifts'] ? this.rosterService.selectedShifts['shifts'] : this.shifts;
        currentClients = this.rosterService.selectedShifts['clients'] ? this.rosterService.selectedShifts['clients'] : this.clients;
        this.changeShifts({shifts: currentShifts, clients: currentClients, statuses: this.rosterService.selectedStatuses}, this.rosterService.selectedStatuses.length ? true : false);
        break;
      case 'client':
        currentShifts = this.shifts;
        let currentClient = this.clients.find(cl => cl.uuid === this.currentAccount.uuid);
        currentClients.push(currentClient);
        this.changeShifts({shifts: currentShifts, clients: currentClients, statuses: this.rosterService.selectedStatuses}, this.rosterService.selectedStatuses.length ? true : false);
        break;
      case 'supplier':
        this.shifts.forEach(s => {
          let client = this.clients.find(cl => cl.uuid === s.client_uuid || s.tasks.some(t => t.supplier.uuid === cl.uuid));
          let venue = this.venues.filter(v => v?.uuid === s.venue?.uuid);
          if (venue) {
            client.venues = venue;
            if (s?.tasks && s?.tasks.length) {
              let newVenue = s.venue;
              if (venue.some(v => v?.uuid !== newVenue.uuid)) {
                client.venues.push(newVenue);
              }
            }
          }
          currentShifts.push(s);
          if (client.venues && client.venues.length) {
            currentClients.push(client);
          }
        });
        this.changeShifts({shifts: currentShifts, clients: currentClients, statuses: this.rosterService.selectedStatuses}, this.rosterService.selectedStatuses?.length ? true : false);
        break;
    }
  }


  gotoDate(event: any) {
    this.viewDate = moment(event).startOf('day').toDate();
  }

  filterListSections(dateCheck) {
    const viewDate = moment(this.viewDate);
    const start = viewDate.startOf('week').format();
    const end = viewDate.endOf('week').format();
    return moment(dateCheck).isBetween(start, end, 'day', '[]');
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
