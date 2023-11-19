import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";

import { MatTableDataSource } from "@angular/material/table";
import { Sort } from "@angular/material/sort";
import { EMPTY, of, Subject } from "rxjs";
import { catchError, finalize, takeUntil, tap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";

import { fuseAnimations } from "@fuse/animations";
import moment from "moment";

import { CalendarView } from "angular-calendar";
import { AccountService } from "app/core/services/account/account.service";
import { RosterService } from "app/core/services/roster/roster.service";
import { IncidentReportingService } from "../../../../core/services/incidents/incident-reporting.service";
import { FormTemplatesService } from "app/core/services/form-templates/form-templates.service";

@Component({
  selector: "app-incident-reporting",
  templateUrl: "./incident-reporting.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IncidentReportingComponent implements OnInit, OnDestroy {

  @ViewChild('matDrawerFilterIncidents') matDrawerFilterIncidents: MatDrawer;


  incidentsSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
  incidents = [];
  reserveShifts = [];
  unsubscribeAll = new Subject<any>();

  displayedColumns: string[] = [
    "status",
    "datetime",
    "venue",
    "client",
    "reportId",
    "created",
    "editedBy",
    "lastModified",
    "action"
  ];
  viewAs: FormControl;

  viewAngularCalendar: CalendarView = CalendarView.Week;
  view: string;
  viewDate: Date
  viewSpinner: boolean = false;

  getShiftsMonth;
  getShiftsYear;
  getShiftsWeek;
  startDate: any;
  endDate: any;
  currentDate: any;
  selectedDate: any;
  currentAccount;

  shifts = [];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private rosterService: RosterService,
    private incidentService: IncidentReportingService,
    private templateService: FormTemplatesService
  ) {
    this.incidentsSource = new MatTableDataSource([]);
    this.viewAs = new FormControl('subscriber');
  }

  ngOnInit() {
    // const year = moment().isoWeekYear();
    // const week = moment().isoWeek();

    this.viewSpinner = true;
    this.accountService.currentAccount
      .pipe(
        tap((res) => {
          this.currentAccount = res;
          if(this.currentAccount.uuid) {
            this.templateService.getAllTemplates(this.currentAccount.uuid).subscribe();
            this.initCalendar();
            // this.dateChanged();
            // this.generateShiftData();
          } else {
            return of([]);
          }
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();

      const selectedDate = this.templateService.getSelectedDate();
      if (selectedDate) {
        const { year, month, week } = selectedDate;
        this.viewDate = moment().year(year).month(month).week(week).startOf('week').toDate();
        // this.viewDate = moment(selectedDate).startOf('d').toDate();
        this.templateService.setSelectedDate(selectedDate);
      }else{
        this.viewDate  = moment().startOf('d').toDate();
      }
      this.dateChanged()
  }

  viewDateString() {
    const viewDate = moment(this.viewDate);
    this.startDate = viewDate.startOf('isoWeek');
    this.endDate = viewDate.endOf('isoWeek');
    return viewDate.startOf('isoWeek').format('D ') + viewDate.endOf('isoWeek').format('- D MMMM YY');
  }
  dateChanged() {
    this.getShiftsYear = moment(this.viewDate).year();
    this.getShiftsMonth = moment(this.viewDate).month();
    this.getShiftsWeek = moment(this.viewDate).week();
    const date = {
      year : this.getShiftsYear,
      month : this.getShiftsMonth,
      week : this.getShiftsWeek
    }
    this.refreshShifts();


    this.templateService.setSelectedDate(date);


  }

  viewAsChanged(event) {
    this.dateChanged();
  }

  updateShifts(event) {
    switch (event.value) {
      case 'subscriber':
        this.shifts = this.reserveShifts.filter(s => s.account_uuid === this.currentAccount.uuid);
        break;
      case 'client':
        this.shifts = this.reserveShifts.filter(s => s.client_uuid === this.currentAccount.uuid);

        break;
      case 'supplier':
        this.shifts = this.reserveShifts.filter(s => s.tasks.some(t => t.supplier.uuid === this.currentAccount.uuid));
        break;
    }
  }

  initCalendar() {
    this.selectedDate = moment();
    this.startDate = this.selectedDate.clone().startOf('isoWeek');
    this.endDate = this.selectedDate.clone().endOf('isoWeek');
  }

  gotoDate(event: any) {
    this.viewDate = moment(event).startOf('day').toDate();
    this.dateChanged()
  }

  refreshShifts() {
    // this.getShiftsByView()
    return this.rosterService
      .getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, this.viewAs, this.getShiftsYear, null, this.getShiftsWeek, 'Incident Report')
      .pipe(
        tap((res) => {
          this.shifts = res;
          this.reserveShifts = res;
          this.updateShifts(this.viewAs);
        }),
        finalize(() => {
          this.generateShiftData();
        })
      )
      .subscribe();
  }

  generateShiftData() {
    const incidents = [];
    this.shifts?.forEach((shift) => {

      shift?.form_data?.forEach((sForm) => {
        if (sForm.type == 'Incident Report') {
          //push it to incidents with extra shift info
          let parsedData = {};
          if (typeof sForm.data === "object") {
            const tempData: any = [];
            (sForm.data || []).forEach((item) => {
              tempData[item.Key] = item.Value;
            });
            parsedData = JSON.parse(tempData.data);
          } else if (typeof sForm.data === "string") {
            parsedData = JSON.parse(sForm.data);
          }
          let incident = {
            ...sForm,
            parsedData: parsedData || {},
            task: {},
            shift: {
              uuid: shift?.uuid,
              client: this.currentAccount.clients.find((cl) => cl?.uuid === shift?.client_uuid ),
              venue: shift?.venue,
              datetime: shift?.datetime,
              timeEnd: moment(shift.datetime).add(shift.duration, 'm').format()
            }
          };
          incidents.push(incident);
        }
      });
      shift.tasks.forEach((task) => {

        task?.form_data?.forEach((tForm) => {
          if (tForm.type == 'Incident Report') {
            //push it to incidents with extra shift info
            let parsedData = {};
            if (typeof tForm.data === "object") {
              const tempData: any = [];
              (tForm.data || []).forEach((item) => {
                tempData[item.Key] = item.Value;
              });
              parsedData = JSON.parse(tempData.data);
            } else if (typeof tForm.data === "string") {
              parsedData = JSON.parse(tForm.data);
            }
            let incident =
            {
                ...tForm,
                parsedData: parsedData,
                task: {
                  uuid: task?.uuid,
                  supplier: task?.supplier,
                  resource: task?.resource,
                  supervisor: task?.supervisor,
                  role: task?.role
                },
                shift: {
                  uuid: shift?.uuid,
                  client: [...this.currentAccount.clients, this.currentAccount].find((cl) => cl.uuid == shift.client_uuid),
                  venue: shift?.venue,
                  datetime: shift?.datetime,
                  timeEnd: moment(shift?.datetime).add(shift?.duration, 'm').format()
                }
            };
            incidents.push(incident);
          }
        });
      });
    });
    this.incidents = incidents.sort();
    this.incidentsSource = new MatTableDataSource<any[]>(this.incidents);
    this.viewSpinner = false;
  }

  goToReport(row) {
    this.incidentService.currentReport = row;
    this.router.navigate([`/pages/incident-reporting/report`], {queryParams: {
      shift: row.shift.uuid,
      task: row.task.uuid,
      formId: row.uuid
    }});
  }

  openFilters() {
    this.matDrawerFilterIncidents.toggle();
  }

  closeFilters() {
    this.matDrawerFilterIncidents.toggle();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
