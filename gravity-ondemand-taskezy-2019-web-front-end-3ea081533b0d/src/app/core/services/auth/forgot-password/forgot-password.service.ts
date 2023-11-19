import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  endPoint = environment.apiUrlAuth;

  constructor(private http: HttpClient) { }

  forgotPassword(userData): Observable<any> {
    return this.http.post(`${this.endPoint}/forgot-password/taskezy`, userData);
  }
}
