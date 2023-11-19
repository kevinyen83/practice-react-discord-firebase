import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { EMPTY, Observable, throwError, pipe, finalize, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { retry, switchMap, tap } from 'rxjs/operators';

import { LoginService } from './core/services/auth/login/login.service';
import { RefreshService } from './core/services/auth/refresh/refresh.service';
import { FuseLoadingService } from '@fuse/services/loading';
import { FuseAlertService } from '@fuse/components/alert';
import { environment } from 'environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  // private local = environment.e2e;

  constructor(private loginService: LoginService, private refreshService: RefreshService, private snackBar: MatSnackBar, private _fuseLoadingService: FuseLoadingService, private _fuseAlertService: FuseAlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoadingBar();
    // if(request.url.includes('gravityfusion') &&
    // ( !request.url.includes('login') &&
    //   !request.url.includes('register') &&
    //   !request.url.includes('verify-email') &&
    //   !request.url.includes('forgot-password')
    // )) {
    if (request.url.includes('gravityfusion.com.au')) {
      request = this.addAuthHeader(request);
    }
    // }
    return next.handle(request).pipe(
      retry(1),
      catchError((error) => {
        console.log('sdsd');
        if(request.url.includes('refresh')) {
          this.loginService.logOutWrapper();
        }
        return this.handleResponseError(error, request, next);
      }),
      finalize(() => this.hideLoadingBar())
    ) as Observable<HttpEvent<any>>;
  }

  addAuthHeader(request) {
    const authHeader = localStorage.getItem('token');
    if (authHeader) {
      return request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
    }
    return request;
  }

  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable((observer) => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;

      return this.refreshService.refreshWithRefreshToken().pipe(
        tap(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next({});
        }),
        catchError(() => {
          this.refreshTokenInProgress = false;
          this.logout();
          return EMPTY;
        })
      );
    }
  }

  logout() {
    this.loginService.signOut();
  }

  handleResponseError(error, request?, next?) {
    if (error.error instanceof ErrorEvent) {
      // client-side error
      return throwError(() => new Error(error));
    } else {
      // server-side error
      if (error.status === 0) {
        return 'Error connecting to server, try again later.';
        // } else if (error.url.includes(`${environment.apiUrlAuth}`)) {
        //   this.snackBar.open(`${error.error}`, 'X', {
        //     duration: 2000,
        //     verticalPosition: 'top',
        //     horizontalPosition: 'center',
        //   });
        // } else if (error.url.includes(`${environment.apiUrlBusinessAccount}`)) {
        //   this.snackBar.open(`${error.error}`, 'X', {
        //     duration: 2000,
        //     verticalPosition: 'top',
        //     horizontalPosition: 'center',
        //   });
        // } else if (error.url.includes(`${environment.apiUrlCompliance}`)) {
        //   this.snackBar.open(`${error.error}`, 'X', {
        //     duration: 2000,
        //     verticalPosition: 'top',
        //     horizontalPosition: 'center',
        //   });
        // } else if (error.url.includes(`${environment.apiUrlRoster}`)) {
        //   this.snackBar.open(`${error.error}`, 'X', {
        //     duration: 2000,
        //     verticalPosition: 'top',
        //     horizontalPosition: 'center',
        //   });
      } else {
        if (error.status === 406) {
          if (error.error.includes('[Token is expired]')) {
            localStorage.removeItem('token');
            return this.refreshToken().pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError((e) => {
                if (!error.error.includes('[Token is expired]')) {
                  return this.handleResponseError(e);
                } else {
                  this.logout();
                }
              })
            );
          } else {
            this.logout();
          }
          // Not Acceptable token, Invalid Sig or Segments # etc
          // Log Out the User.
          return EMPTY;
        } else if (error.status === 428) {
          // No Token Used.
          // Log Out the User.
          this.showSnackBar(error.error);
          this.logout();
          return EMPTY;
        } else if (error.status === 412) {
          // user not found
          this.showSnackBar(error.error);
          if(error.url.includes(`${environment.apiUrlCompliance}/security/nsw`) || error.url.includes(`${environment.apiUrlCompliance}/liquor/nsw`)) {
            return new Error(error)
          } else {
            return EMPTY;
          }
        } else if (error.status === 403) {
          // status forbidden dont have access
          this.showSnackBar(error.error);
          this.logout();
          return EMPTY;
        } else if (error.status === 401) {
          // status Authorization Error
          if (request?.responseType === 'blob') {
            return EMPTY;
          } else {
            this.showSnackBar(error.error);
            this.logout();
            return EMPTY;
          }
        } else if (error.status === 502) {
          // status Authorization Error
          this.showSnackBar(error.error);
          this.logout();
          return EMPTY;
        }

        return throwError(() => error);
      }
    }
  }

  showSnackBar(text) {
    this.snackBar.open(`${text}`, 'X', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  /**
   * Show the loading bar
   */
  showLoadingBar(): void {
    this._fuseLoadingService.show();
  }

  /**
   * Hide the loading bar
   */
  hideLoadingBar(): void {
    this._fuseLoadingService.hide();
  }
}
