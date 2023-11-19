import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BehaviorSubject, Observable} from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MobileVerificationService {
  users = [];
  _isSendCode = new BehaviorSubject(false);
  endPoint = environment.apiUrlAuth;

  constructor(private http: HttpClient) { }

  get isSendCode() {
    return this._isSendCode;
  }

  set isSendCode(obj: any) {
    this._isSendCode.next(obj);
  }

  verifyMobile(mobileToken): Observable<any> {
    return this.http.post(`${this.endPoint}/verify-mobile/${mobileToken}`, {});
  }

  saveNewNumber(mobile): Observable<any> {
    const formData = new FormData();
    formData.append('mobile', mobile);
    return this.http.put(`${this.endPoint}/update-mobile`, formData);
  }

  resendVerifyMobile(params): Observable<any> {
    return this.http.put(`${this.endPoint}/verify-mobile/taskezy`, {} , {params});
  }
}
