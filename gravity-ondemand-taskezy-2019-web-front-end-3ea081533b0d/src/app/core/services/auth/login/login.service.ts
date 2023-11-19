import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, Subject, pipe, combineLatest, EMPTY, catchError, take, skip, of, map, tap, takeUntil, switchMap, ReplaySubject, from, takeWhile, throwError } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { Intercom } from 'ng-intercom';
import * as Sentry from '@sentry/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from '../../../../../environments/environment';
import { AccountService } from 'app/core/services/account/account.service';
import { UserProfileService } from 'app/core/services/user-profile/user-profile.service';
import { RosterService } from '../../roster/roster.service';
import { VERSION } from '../../../../../environments/version';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token;
  status;
  currentAccount;
  currentUser;
  version: string;
  errors = new Subject<any>();
  endPoint = environment.apiUrlAuth;
  tokenData = new ReplaySubject<any>(1);
  // _tokenData: any = {};
  stopSignal$ = new Subject();
  loggedOutSignal$ = new Subject();
  tenant = environment.tenant;

  refreshing = false;

  private local = environment.e2e;

  constructor(
    private http: HttpClient,
    private router: Router,
    public intercom: Intercom,
    private accountService: AccountService,
    private userProfileService: UserProfileService,
    private rosterService: RosterService,
    public fireAuth: AngularFireAuth
  ) {
    this.version = `${VERSION.version}.${VERSION.hash}`;
  }

  signIn(userData): Observable<any> {
    this.stopSignal$ = new Subject();
    this.loggedOutSignal$ = new Subject();
    // this.stopLoginSignal$ = new Subject();
    if (this.local) {
      return this.http.get(`api/login/${encodeURI(userData.password)}`).pipe(
        tap((token: any) => {
          this.postLoginValidationChecks(token);
        }),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        takeUntil(this.stopSignal$),
        map((token) => {
          token.token = token.id;
          return token;
        }),
        this.loginPipe()
      );
    } else {
      return this.http.post(`${this.endPoint}/login/taskezy`, userData).pipe(
        tap((token: any) => {
          console.log(token);
          this.postLoginValidationChecks(token);
        }),
        takeUntil(this.stopSignal$),
        this.loginPipe()
      );
    }
  }

  setRememberMe(val, email?) {
    localStorage.setItem('rememberMe', val.toString());
    if (val) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }

  postLoginValidationChecks(token) {
    localStorage.setItem('refreshToken', token.refreshToken);
    localStorage.setItem('token', token.token);
    localStorage.setItem('user_id', token.user.id);
    // localStorage.setItem('token', token.token);
    const tokenData = this.getTokenData(token.token);
    if (token.statusCode === 212) {
      this.router.navigate(['/auth/verify-email']);
      this.stopSignal$.next(true);
    } else {
      // localStorage.setItem('token', token.token);
      this.accountService.getAllAccounts().subscribe();
      if (!tokenData.email_verified) {
        this.router.navigate(['/auth/verify-email']);
        this.stopSignal$.next(true);
      } else if (!tokenData.mobile_verified) {
        this.router.navigate(['/auth/verify-mobile']);
        this.stopSignal$.next(true);
      } else if (tokenData.profile_verified < 2) {
        this.router.navigate(['/auth/id-check']);
        this.stopSignal$.next(true);
      } else {
        // Fully Verified
        this.token = token.token;
        // localStorage.setItem('refreshToken', token.refreshToken);
        // localStorage.setItem('token', token.token);
        // localStorage.setItem('user_id', token.user.id);
        // localStorage.setItem('email', tokenData.email);
      }
    }
    return tokenData;
  }

  refreshLoginToken(body): Observable<any> {
    this.refreshing = true;
    this.stopSignal$ = new Subject();
    this.loggedOutSignal$ = new Subject();
    // this.stopLoginSignal$ = new Subject();
    if (this.local) {
      return this.http.get(`api/login/${encodeURI(body.refreshToken)}`).pipe(
        tap((token: any) => {
          this.postLoginValidationChecks(token);
        }),
        takeUntil(this.stopSignal$),
        map((token) => {
          token.token = token.id;
          return token;
        }),
        this.loginPipe()
        // login pipe?
      );
    } else {
      return this.http.post(`${this.endPoint}/refresh`, body).pipe(
        tap((token: any) => {
          console.log(token);
          this.postLoginValidationChecks(token);
        }),
        takeUntil(this.stopSignal$),
        this.loginPipe(),
        catchError((error) => {
          console.error('Error occurred:', error);
          // Handle or process the error as needed
          // e.g. maybe you want to return a default value:
          // return of(defaultValue);
          // or re-throw the error:
          return throwError(error);
      })
      );
    }
  }

  getTokenData(token) {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    this.tokenData.next(tokenData);
    return tokenData;
  }
  // verifyToken(token): Observable<any> {
  //   return this.http.post(`${this.endPoint}/jwt/validate`, token);
  // }

  signOut() {
    this.loggedOutSignal$.next(true);
    this.refreshing = false;
    // this should call the logout API
    const refreshToken = localStorage.getItem('refreshToken');
    if(!environment.e2e) {
      this.intercom.shutdown();
      this.intercom.boot({
        app_id: environment.intercomAPIKey,
        widget: {
          activator: '#intercom'
        },
        version: this.version
      });
    }
    // this.stopLoginSignal$.next(true);
    if (this.local) {
      this.http
        .get(`api/login/${encodeURI(refreshToken)}`)
        .pipe(
          tap((res) => {
            this.removeToken();
            this.cleanUpData();
            this.router.navigate(['/auth/login']);
          }),
          catchError((err) => {
            console.log(err);
            this.router.navigate(['/auth/login']);
            this.removeToken();
            this.cleanUpData();
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      const formData: any = new FormData();
      formData.append('refreshToken', refreshToken);
      this.http
        .post(`${this.endPoint}/logout/taskezy`, formData)
        .pipe(
          tap((res) => {
            this.logOutWrapper();
          }),
          catchError((err) => {
            this.logOutWrapper();
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  getToken(): string {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  getTokenExpirationDate(token: string): Date {
    try {
      const decoded: any = jwtDecode(token, { header: true });
      if (!decoded.exp) {
        return null;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    } catch (e) {
      return null;
    }
  }

  authCheck() {
    return !!this.getToken();
  }

  isAuthenticated(): Observable<any> {
    const checkAuth = !!this.getToken();
    if (checkAuth) {
      return combineLatest([
        this.tokenData,
        this.accountService.accountsCount
      ]).pipe(
        map((res: any) => {
          console.log(res);
        return {
          isAuth: checkAuth,
          accountCount: res[1],
          emailVerified: res[0].email_verified,
          mobileVerified: res[0].mobile_verified,
          profileVerified: res[0].profile_verified
        }
        })
      );
    } else {
      return of({
        isAuth: checkAuth
      });
    }
  }

  loginPipe = () =>
    pipe(
      switchMap((res: any) => {
        console.log(res);
        this.userProfileService.currentUser = this.currentUser = res.user;

        const intercomData = {
          app_id: environment.intercomAPIKey,
          widget: {
            activator: '#intercom'
          },
          version: this.version
        };

        if (this.currentUser.id) {
          intercomData['email'] = this.currentUser.email;
          intercomData['user_id'] = this.currentUser.id;
          if(!environment.e2e) {
            this.intercom.boot(intercomData);
            Sentry.setUser({
              id: this.currentUser.id,
              email: this.currentUser.email
            });
          }
        } else {
          intercomData['email'] = '';
          intercomData['user_id'] = '';
          if(!environment.e2e) {
            this.intercom.boot(intercomData);
            Sentry.setUser({
              id: '',
              email: ''
            });
          }
          localStorage.removeItem('user_id');
        }

        return this.accountService.listAccounts;
      }),
      // skip(1),
      // takeWhile((res) => res[0].id),
      takeUntil(this.loggedOutSignal$),
      switchMap((resList: any) => {
        // const userProfile = this.userProfileService.currentUser.getValue();
        // if (!userProfile.id) {
        //   return EMPTY;
        // }
        const accounts = resList;

        console.log(accounts);
        if (this.currentUser.id) {

          const currAccnt = localStorage.getItem('currentAccount');
          console.log(currAccnt);
          if (currAccnt) {
            return this.accountService.setCurrentAccount(currAccnt);
          } else {
            if (
              this.currentUser.data[this.tenant] &&
              this.currentUser.data[this.tenant].defaultAccount &&
              this.currentUser.data[this.tenant].defaultAccount !== '' &&
              accounts.filter((account) => account.uuid === this.currentUser.data[this.tenant].defaultAccount).length > 0
            ) {
              console.log('me');
              return this.accountService.setCurrentAccount(this.currentUser.data[this.tenant].defaultAccount);
            } else {
              console.log('no me');
              if (accounts.length > 0) {
                console.log('no me 1');
                return this.accountService.setCurrentAccount(accounts[0].uuid);
              } else {
                console.log('no me 2');
                return of({});
              }
            }
          }
        } else {
          return of({});
        }
      }),
      tap((res: any) => {
        console.log('here?', res);
        this.currentAccount = res;
        this.accountService.getMyAccountInvites();
        if (this.currentAccount.uuid) {
          this.accountService.getAdmins(this.currentAccount.uuid);
          this.accountService.getConnectedResources(this.currentAccount.uuid);
          this.accountService.getConnectedVenues(this.currentAccount.uuid);
          if (!this.refreshing) {
            this.router.navigate(['/pages/home']);
          }
        } else {
          this.router.navigate(['/welcome']);
          // TODO: Force the user to go to the create primary, accept invites etc page.
          console.log('this user doesnt have any accounts linked to them');
        }
      })
    );

  loginToFirebase() {
    if (this.token) {
      return this.http.post(`${this.endPoint}/jwt/firebase`, { token: this.token }).pipe(
        switchMap((fbToken: any) => {
          if (fbToken.statusCode === 200) {
            return from(this.fireAuth.signInWithCustomToken(fbToken.token));
          } else {
            return EMPTY;
          }
        }),
        tap(
          (success) => {
            console.log(success);
          },
          (error) => {
            console.log(error);
          }
        )
      );
    } else {
      return EMPTY;
    }
  }

  logOutWrapper(): void {
    this.router.navigate(['/auth/login']);
    this.removeToken();
    this.cleanUpData();
  }

  private removeToken(): void {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('currentAccount');
  }

  private cleanUpData(): void {
    this.accountService.cleanUp();
    this.userProfileService.cleanUp();
    this.rosterService.cleanUp();
    this.accountService.cleanUp();
  }
}
