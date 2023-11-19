import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormTemplatesService {
  reportTemplates = new BehaviorSubject<any>({});

  private urlTemplates = environment.apiUrlTemplates;
  private local = environment.e2e;
  private selectedDate: Date;
  constructor(private http: HttpClient) { }

  getAllTemplates(uuid): Observable <any> {
    if (this.local) {
      return of([]);
    } else {
      return combineLatest([
        this.http.get(`${this.urlTemplates}/template/list`),
        this.http.get(`${this.urlTemplates}/template/list/${uuid}`)
      ]).pipe(
        tap(([global, account]) => {
          this.reportTemplates.next({ global, account });
        })
      );
    }
  }

  getTemplateByUUID(uuid): Observable<any> {
    return this.http.get(`${this.urlTemplates}/template/${uuid}`);
  }

  addTemplate(template): Observable<any> {
    return this.http.post(`${this.urlTemplates}/template`, template);
  }

  updateTemplate(template) {
    return this.http.put(`${this.urlTemplates}/template/${template.uuid}`, template);
  }

  getSelectedDate(): any {
    return this.selectedDate;
  }

  setSelectedDate(date): any {
    this.selectedDate = date;
  }

}
