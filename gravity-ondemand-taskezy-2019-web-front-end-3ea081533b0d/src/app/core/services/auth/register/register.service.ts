import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  users = [];
  currentUser = new Subject<any>();
  error = new Subject<string>();
  dataFields: any;

  private endPoint = environment.apiUrlAuth;

  constructor(private http: HttpClient, public loginService: LoginService) {}

  registerUser(userData): Observable<any> {
    return this.http
      .post(`${this.endPoint}/register/taskezy`, userData)
      .pipe
      // tap((token: any) => {
      //   this.loginService.postLoginValidationChecks(token);
      // }),
      // this.loginService.loginPipe()
      ();
  }
}
