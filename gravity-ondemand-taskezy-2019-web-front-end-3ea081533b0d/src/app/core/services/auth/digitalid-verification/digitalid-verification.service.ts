import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DigitalIDVerificationService {
  users = [];
  endPoint = environment.apiUrlAuth;

  constructor(private http: HttpClient) { }

  verifyCode(code): Observable<any> {
    return this.http.post(`${this.endPoint}/digitalid/${code}`, {});
  }
}
