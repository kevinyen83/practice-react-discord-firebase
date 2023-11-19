import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  users = [];
  endPoint = environment.apiUrlAuth;

  constructor(private http: HttpClient) { }

  verifyEmail(emailToken): Observable<any> {
    return this.http.post(`${this.endPoint}/verify-email/${emailToken}`, {});
  }

  resendVerifyEmail(email): Observable<any> {
    const formData: any = new FormData();
    formData.append('email', email);
    return this.http.put(`${this.endPoint}/verify-email/taskezy`, formData);
  }
}
