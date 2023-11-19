import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { Subject, combineLatest, EMPTY } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { catchError, pairwise, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ChartComponent } from 'ng-apexcharts';
import { filter, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { fuseAnimations } from '@fuse/animations';
import { RosterService } from '../../../core/services/roster/roster.service';
import { AccountService } from 'app/core/services/account/account.service';
import { CalendarDate } from '../roster/roster.component';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { ModalWelcomeComponent } from './modal-welcome/modal-welcome.component';
import { HomeService } from 'app/core/services/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  statistics: any[] = [];
  viewSpinner = false;
  spinnerColor = 'primary';
  profiles = [];
  weeks = [];
  currentWeek;
  dataTable = [];
  shifts = [];
  view: any[] = [
    300,
    100
  ];
  ELEMENT_DATA = [
    { name: 'Confirmed', suppliers: 0, resources: 0 },
    { name: 'Pending', suppliers: 0, resources: 0 },
    { name: 'Declined', suppliers: 0, resources: 0 }
  ];
  unsubscribeAll = new Subject<any>();
  clients = [];
  currentAccount: any;
  currentUser: any;
  // @ViewChild('chart') chart: ChartComponent;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = [
    'name',
    // 'clients',
    'suppliers',
    'resources'
  ];

  constructor(
    private accountService: AccountService,
    private changeDetectorRef: ChangeDetectorRef,
    private homeService: HomeService,
    private router: Router,
    public dialog: MatDialog,
    private userProfileService: UserProfileService,
    private rosterService: RosterService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((e) => e instanceof RoutesRecognized),
        pairwise(),
        take(1)
      )
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects === '/welcome') {
          this.getWelcomeModal();
          this.homeService.disabledItems = [
            'Dashboard',
            'Suppliers',
            'Resources',
            'Clients',
            'Roster',
            'Timesheet Register',
            'Incidents',
            'Incident Report',
            'Interviews',
            'Assessments',
            'Assessment Templates',
            'Profile',
            'Profile Admins',
            'Logs',
            'Resource Pool'
          ];
          this.homeService.activeLinks.next(['Details']);
        }
      });
    this.handleCreateData();
    this.viewSpinner = true;
    this.resetTable();

    const year = moment().isoWeekYear();
    const week = moment().isoWeek();

    combineLatest([
      this.userProfileService.currentUser,
      this.accountService.currentAccount
    ])
      .pipe(
        takeUntil(this.unsubscribeAll),
        switchMap(
          ([
            res1,
            res2
          ]: any) => {
            this.currentUser = res1;
            this.currentAccount = res2;
            this.clients = this.currentAccount.clients || [];
            if (this.currentAccount.uuid) {
              return this.fetchShiftsByWeek(year, week);
            } else {
              return EMPTY;
            }
          }
        ),
        tap((res: any) => {
          if (res) {
            this.shifts = res;
            this.shifts.forEach((shift) => {
              shift['resource_status'] = 0;
              shift['supplier_status'] = 0;
                shift.tasks?.forEach((task) => {
                  if (task.resource.release_status != 2 && shift.resource_status < task.resource.release_status) {
                    shift.resource_status = task.resource.release_status;
                  }
                  if (task.supplier.release_status != 2 && shift.supplier_status < task.supplier.release_status) {
                    shift.supplier_status = task.supplier.release_status;
                  }
                });
            });
          }
          this.generateCalendar();
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.viewSpinner = false;
        }),
        catchError((err) => {
          console.log(err);
          this.viewSpinner = false;
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  fetchShiftsByWeek(year, week) {
    if (this.currentAccount.uuid) {
      return this.rosterService.getShiftsForPrimaryAccountWithParams(this.currentAccount.uuid, null , year, null, week,null);
    }
  }

  getWelcomeModal() {
    const dialogRef = this.dialog.open(ModalWelcomeComponent, {
      width: '1200px',
      panelClass: 'rounded-3xl',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  resetTable() {
    this.ELEMENT_DATA.forEach((tr) => {
      tr.resources = 0;
      tr.suppliers = 0;
      // tr.clients = 0;
    });
  }

  generateCalendar() {
    this.handleCreateData();
    this.currentWeek = [];
    const dates = this.fillDates(moment());
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
    this.currentWeek = this.weeks[0];
    this.currentWeek.forEach((day) => {
      this.statistics.forEach((statis) => {
        statis.series[0].data.push(0);
        statis.xaxis.categories.push(moment(day.mDate).format('YYYY-MM-DD'));
      });
    });
    this.generateChartData();
  }

  fillDates(currentMoment: any): CalendarDate[] {
    const firstOfWeek = moment(currentMoment).startOf('isoWeek').day();
    const firstDayOfGrid = moment(currentMoment).startOf('isoWeek').subtract(firstOfWeek, 'days').add(1, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 7).map((date: number): CalendarDate => {
      const d = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(d),
        mDate: d
      };
    });
  }

  isToday(date: any): boolean {
    return moment().isSame(moment(date), 'day');
  }

  generateTableData() {
    this.resetTable();
    this.shifts.forEach((shift) => {
      // if (shift.client?.status === 1) {
      //   this.ELEMENT_DATA[0].clients++;
      // } else if (shift.client?.status === 0) {
      //   this.ELEMENT_DATA[1].clients++;
      // } else if (shift.client?.status === 2) {
      //   this.ELEMENT_DATA[2].clients++;
      // }
      shift.tasks.forEach((task) => {
        if (task.resource?.release_status === 2) {
          this.ELEMENT_DATA[0].resources++;
        } else if (!task.resource?.release_status) {
          this.ELEMENT_DATA[1].resources++;
        } else if (task.resource?.release_status === 3) {
          this.ELEMENT_DATA[2].resources++;
        }

        if (task.supplier?.release_status === 2) {
          this.ELEMENT_DATA[0].suppliers++;
        } else if (!task.supplier?.release_status) {
          this.ELEMENT_DATA[1].suppliers++;
        } else if (task.supplier?.release_status === 3) {
          this.ELEMENT_DATA[2].suppliers++;
        }
      });
    });
    this.dataTable = this.ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(this.dataTable);
  }


  generateChartData() {
    this.statistics.forEach((one, index) => {
      switch (one.series[0].name) {
        case 'Total tasks':
          let total = 0;
          this.shifts.map((shift) => {
            if (shift.tasks.length) {
              shift.tasks.forEach(t => {
                total++;
                one.xaxis.categories.forEach((g, i) => {
                  if (moment(t.datetime).format('YYYY-MM-DD') === g) {
                    one.series[0].data[i]++;
                  }
                });
              });
            }
          });
          one.total = total;
          break;
        case 'Accepted tasks':
          let totalAccepted = 0;
          this.shifts.forEach(s => {
            if (s.release_status === 3 && s.tasks.length) {
              s.tasks.forEach(t => {
                if (t.resource?.release_status === 2) {
                  totalAccepted++;
                  one.xaxis.categories.forEach((g, i) => {
                    if (moment(t.datetime).format('YYYY-MM-DD') === g) {
                      // g.value++;
                      one.series[0].data[i]++;
                    }
                  });
                }
              })
            }
          });
          one.total = totalAccepted;
          break;
        case 'Pending tasks':
          let totalPending = 0;
          this.shifts.forEach((s) => {
            if (s.tasks.length) {
              s.tasks.forEach(t => {
                if (!t.resource?.release_status) {
                  totalPending++;
                  one.xaxis.categories.forEach((g, i) => {
                    if (moment(t.datetime).format('YYYY-MM-DD') === g) {
                      // g.value++;
                      one.series[0].data[i]++;
                    }
                  });
                }
              });
            }
          });
          one.total = totalPending;
          break;
        case 'Declined tasks':
          let totalDeclined = 0;
          this.shifts.forEach((s) => {
            if (s.release_status === 3 && s.tasks.length) {
              s.tasks.forEach(t => {
                if (t.resource?.release_status === 3) {
                  //someone declined
                  totalDeclined++;
                  one.xaxis.categories.forEach((g, i) => {
                    if (moment(t.datetime).format('YYYY-MM-DD') === g) {
                      // g.value++;
                      one.series[0].data[i]++;
                    }
                  });
                }
              })
            }
          });
          one.total = totalDeclined;
          break;
        case 'Completed tasks':
          let totalCompleted = 0;
          this.shifts.forEach((s) => {
            if (s.tasks.length) {
              s.tasks.forEach(t => {
                if (t.timesheet?.signoff?.signature) {
                  totalCompleted++;
                  one.xaxis.categories.forEach((g, i) => {
                    if (moment(t.datetime).format('YYYY-MM-DD') === g) {
                      // g.value++;
                      one.series[0].data[i]++;
                    }
                  });
                }
              });
            }
          });
          one.total = totalCompleted;
          break;
        case 'Total Confirmed Hours':
          let totalConfirmedHours = 0;
          this.shifts.map((shift) => {
            if (shift.release_status === 3 && shift.tasks.length) {
              shift.tasks.forEach(t => {
                if (t.resource?.release_status === 2) {
                  totalConfirmedHours = totalConfirmedHours + t.duration;
                  one.xaxis.categories.forEach((g, i) => {
                    if (moment(t.datetime).format('YYYY-MM-DD') === g) {
                      one.series[0].data[i] = one.series[0].data[i] + t.duration / 60;
                    }
                  });
                }
              });
            }
          });
          one.total = totalConfirmedHours;
          break;
        case 'Total Pending Hours':
          let totalPendingHours = 0;
          this.shifts.map((shift) => {
            if (shift.tasks.length) {
              shift.tasks.forEach(t => {
                if (!t.resource?.release_status) {
                  totalPendingHours = totalPendingHours + t.duration;
                  for (let i = 0; i <= one.xaxis.categories.length; i++) {
                    if (moment(t.datetime).format('YYYY-MM-DD') === one.xaxis.categories[i]) {
                      one.series[0].data[i] = one.series[0].data[i] + t.duration / 60;
                      break;
                    }
                  }
                }
              });
            }
          });
          one.total = totalPendingHours;
          break;
        case 'Total Declined Hours':
          let totalDeclinedHours = 0;
          this.shifts.map((shift) => {
            if (shift.release_status === 3 && shift.tasks.length) {
              shift.tasks.forEach(t => {
                if (t.resource?.release_status === 3) {
                  totalDeclinedHours = totalDeclinedHours + t.duration;
                  for (let i = 0; i <= one.xaxis.categories.length; i++) {
                    if (moment(t.datetime).format('YYYY-MM-DD') === one.xaxis.categories[i]) {
                      one.series[0].data[i] = one.series[0].data[i] + t.duration / 60;
                      break;
                    }
                  }
                }
              });
            }
          });
          one.total = totalDeclinedHours;
          break;
        case 'Total Resource Utilisation':
          let totalResourceUtlisation = 0
          this.shifts.forEach((shift) => {

            shift.tasks.forEach((task) => {
              if (task.resource?.release_status === 2) {

                let taskHour = parseFloat(moment(task.datetime).format('HH'))
                let taskMinutes = parseFloat(moment(task.datetime).format('mm'))
                let totalAdditionalDays = Math.trunc(((taskHour * 60) + taskMinutes + task.duration) / 1440)


                for (let i = 0; i <= one.xaxis.categories.length; i++) {
                  if (moment(task.datetime).format('YYYY-MM-DD') === one.xaxis.categories[i]) {
                    for (let j = 0; j <= totalAdditionalDays; j++) {
                      if (i + j < 8) {


                        one.series[0].data[i + j]++
                        totalResourceUtlisation++
                      }
                    }
                  }
                }
              }
            });
            one.total = totalResourceUtlisation;
          });
          break;
      }
    });
    this.changeDetectorRef.markForCheck();
    this.statistics[5].total = `${Math.floor(this.statistics[5].total / 60)}h ${this.statistics[5].total % 60}m`;
    this.statistics[6].total = `${Math.floor(this.statistics[6].total / 60)}h ${this.statistics[6].total % 60}m`;
    this.statistics[7].total = `${Math.floor(this.statistics[7].total / 60)}h ${this.statistics[7].total % 60}m`;
    this.generateTableData();
  }

  handleCreateData() {
    const sampleData = [
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Total tasks',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Accepted tasks',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Pending tasks',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Declined tasks',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Completed tasks',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Total Confirmed Hours',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Total Pending Hours',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Total Declined Hours',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      },
      {
        total: 0,
        icon: 'trending_up',
        colorScheme: {
          domain: ['#41a4f5']
        },
        percent: 0,
        series: [
          {
            name: 'Total Resource Utilisation',
            data: []
          }
        ],
        chart: {
          height: 200,
          type: 'bar',
          toolbar: { show: false }
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: []
        }
      }
    ];
    this.statistics = sampleData;
  }

  lowerKebab(name) {
    return name.toLowerCase().replace(/\s/g, '-')
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
