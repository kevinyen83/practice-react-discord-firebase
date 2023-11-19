import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-copy-shift',
  templateUrl: './copy-shift.component.html'
})
export class CopyShiftComponent implements OnInit {
  copyShiftForm: FormGroup;
  countShifts?: number;
  currentWeek: number;
  currentYear: number;
  notification: string;
  currentDayOfWeek: number;
  problem: any;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  weeks = [];
  years: string[] = ['2012', '2013', '2014', '2015', '2017', '2018', '2019', '2020', '2021'];

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CopyShiftComponent>,
              @Inject(MAT_DIALOG_DATA) @Optional() public data?) { }

  ngOnInit() {
    this.currentWeek = moment().get('week');
    this.currentYear = moment().get('year');
    this.currentDayOfWeek = moment().isoWeekday();
    this.daysOfWeek = this.daysOfWeek.slice(this.currentDayOfWeek);
    this.createCopyShiftForm();
    this.countShifts = this.data.els.length;
    for (let i = 1; i <= 52; i++) {
      this.weeks.push(i);
    }
  }

  createCopyShiftForm(): void {
    this.copyShiftForm = this.formBuilder.group({
      day: [''],
      year: [''],
      week: ['']
    });
  }

  copyShift(form): void {
    const result = {
      day: form.value.day,
      year: form.value.year,
      week: form.value.week
    };
    const copyiedShifts = [];
    let d;
    [...this.data.els].map((shift) => {
      let tasks = shift.tasks.map((task) => {
        return {
          credentials: task.role.credentials,
          note: task.notes[0].note,
          resource_uuid: task.resource.uuid,
          role_uuid:task.role.uuid,
          supervisor: task.supervisor,
          supplier_uuid:task.supplier.uuid,
          task_items: task.items
        }
      })
      this.problem = {
        account_uuid: shift.account_uuid,
        duration: shift.duration,
        notes: shift.notes,
        venue_uuid: shift.venue.uuid,
        client_uuid: shift.client_uuid,
        tasks: tasks
      };
      if (result.day !== '' && result.week === '' && result.year === '') {
        d = moment().set({year: moment().get('year'), week: moment().get('week'), day: result.day,
          hours: moment(shift.datetime).hours(),
          minutes: moment(shift.datetime).minutes()});
        if (result.day === 'Sunday') {
          d = moment().set({year: moment().get('year'), week: moment().get('week') + 1, day: result.day,
            hours: moment(shift.datetime).hours(), minutes: moment(shift.datetime).minutes()});
        }
        this.problem.datetime = moment.utc(d);
        copyiedShifts.push(this.problem);
      }
      if (result.week !== '' && result.year !== '' && result.day === '') {
        d = moment().set({year: result.year, week: result.week, day: moment(shift.datetime).isoWeekday(),
          hours: moment(shift.datetime).hours(), minutes: moment(shift.datetime).minutes()});
        if (moment(d.format('l')).isBefore(moment(moment().format('l')))) {
          this.notification = 'Enter correct date!';
          setTimeout(() => {
            this.notification = '';
          }, 2000);
          return false;
        } else {
          if (d.get('week') > this.currentWeek || +d.get('year') >= +this.currentYear) {
            this.problem.datetime = moment.utc(d);
            copyiedShifts.push(this.problem);
          } else {
            this.notification = 'Enter correct date!';
            setTimeout(() => {
              this.notification = '';
            }, 2000);
            return false;
          }
        }
      }
      if (moment().isBefore(moment(d))) {
        this.dialogRef.close({
          success: true,
          data: copyiedShifts
        });
      }
    });
  }

  cancel(): void {
    this.close();
  }

  close() {
    this.dialogRef.close({
      success: false,
      data: []
    });
  }
}
