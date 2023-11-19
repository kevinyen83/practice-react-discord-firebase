import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  endPoint = environment.apiUrlAuth;

  constructor(private http: HttpClient) { }

  resetPasswordForgot(userData): Observable<any> {
    const changePasswordBody = {
      password: userData.password,
    };
    return this.http.post(`${this.endPoint}/change-password/taskezy/${userData.token}`, changePasswordBody);
  }

  resetPassword(userData) {
    const changePasswordBody = {
      currentPassword: userData.oldPassword,
      loginId: localStorage.getItem('email').toString(),
      password: userData.newPassword,
      refreshToken: localStorage.getItem('refreshToken').toString()
    };
    return this.http.post(`${this.endPoint}/change-password/taskezy`, changePasswordBody);
 }
}
