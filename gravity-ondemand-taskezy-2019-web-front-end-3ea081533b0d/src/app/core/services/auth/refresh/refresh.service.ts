import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { switchMap, take, tap } from 'rxjs/operators';

import { LoginService } from '../login/login.service';
import { filter } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  refreshToken;

  constructor(private loginService: LoginService, private router: Router) {}

  loginWithRefresh() {
    if (localStorage.getItem('refreshToken')) {
      this.refreshWithRefreshToken()
        .pipe(
          // this.loginService.loginPipe(),
          switchMap(() => this.router.events),
          filter((ev) => ev instanceof NavigationEnd),
          take(1)
        )
        .subscribe((navUrl) => {
          if (!this.router.url.includes('/pages')) {
            this.router.navigate(['/pages/home']);
          }
        });
    }
  }

  refreshWithRefreshToken() {
    this.refreshToken = localStorage.getItem('refreshToken');
    console.log('sdss');
    return this.loginService.refreshLoginToken({
      refreshToken: this.refreshToken
    });
  }
}
