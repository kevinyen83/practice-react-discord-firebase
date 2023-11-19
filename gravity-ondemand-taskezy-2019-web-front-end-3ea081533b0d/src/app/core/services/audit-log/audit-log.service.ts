import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  _logs = new BehaviorSubject<any[]>([]);
  _current_log = new BehaviorSubject<any>({});
  endPointLog = environment['apiUrlLog'];

  constructor(private http: HttpClient) {
  }

  get currentLog() {
    return this._current_log.asObservable();
  }

  get logs() {
    return this._logs.asObservable();
  }

  set logs(obj: any) {
    this._logs.next(obj);
  }

  set currentLog(obj: any) {
    this._current_log.next(obj);
  }

  getAuditLogs(): Observable<any> {
    return this.http.get(`${this.endPointLog}`).pipe(
        tap((res: any) => {
          this._logs = res;
        })
    );
  }

  getAuditLog(uuid): Observable<any> {
      return this.http.get(`${this.endPointLog}/${uuid}`).pipe(
        tap((res) => {
          this._current_log = res;
        })
      );
  }
}
