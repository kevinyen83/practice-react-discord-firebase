import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentReportingService {

  _currentReport = new BehaviorSubject<any>({});

  get currentReport() {
    return this._currentReport;
  }
  set currentReport(obj: any) {
    this._currentReport.next(obj);
  }

  constructor() {

  }

  cleanUp() {
    this._currentReport.complete();
    this._currentReport = new BehaviorSubject<any>({});
  }
}
