import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  _currentUser = new BehaviorSubject({});
  localUser: any;
  tenant = environment.tenant;
  private endPoint = environment.apiUrlAuth;
  private local = environment.e2e;

  constructor(private http: HttpClient, private _fuseConfirmationService: FuseConfirmationService, private dialog: MatDialog) {}

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(obj: any) {
    this._currentUser.next(obj);
  }

  getCurrentUserProfile(id?) {
    if (this.local) {
      this.http
        .get(`${this.endPoint}/${id}`)
        .pipe(
          tap((res: any) => {
            this.currentUser = res.user;
          })
        )
        .subscribe();
    } else {
      this.http
        .get(`${this.endPoint}/user`)
        .pipe(
          tap((res: any) => {
            this.currentUser = res.user;
          })
        )
        .subscribe();
    }
  }

  updateUserProfile(profile): Observable<any> {
    if (this.local) {
      return this.http.put(`${this.endPoint}/${encodeURI(profile.id)}`, profile).pipe(
        // switchMap(res => ),
        tap((res: any) => {
          this.currentUser = res.user;
        })
      );
    } else {
      delete profile.id;
      return this.http.put(`${this.endPoint}/user`, profile).pipe(
        // switchMap(res => ),
        tap((res: any) => {
          this.currentUser = res.user;
        })
      );
    }
  }

  updateUserProfileAvatar(avatarUrl, profileTesting?): Observable<any> {
    if (this.local) {
      return this.http.put(`${this.endPoint}/${encodeURI(profileTesting.id)}`, profileTesting);
    } else {
      return this.http.put(`${this.endPoint}/user`, { imageUrl: avatarUrl }).pipe(
        tap((res: any) => {
          this.currentUser = res.user;
        })
      );
    }
  }

  cleanUp() {
    this._currentUser.complete();
    this._currentUser = new BehaviorSubject<any>({});
  }

  makeDefaultAccount(account) {
    // const data = {
    //   title: 'Change Default Account?',
    //   message:
    //     'Are you sure you would like to make ' +
    //     account.detail.name +
    //     ' your default account?',
    //   buttons: [
    //     {
    //       color: 'accent',
    //       title: 'Cancel',
    //       value: false,
    //     },
    //     {
    //       color: 'accent',
    //       title: 'Yes',
    //       value: true,
    //     },
    //   ],
    // };
    const data: FuseConfirmationConfig = {
      title: 'Change Default Account?',
      message: 'Are you sure you would like to make ' + account.detail.name + ' your default account?',
      actions: {
        confirm: {
          show: true,
          label: 'Yes',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Cancel'
        }
      }
    };
    const dialogRef = this._fuseConfirmationService.open(data);
    // const dialogRef = this.dialog.open(ConfirmActionComponent, {
    //   data,
    // });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.setDefaultAccount(account.uuid)
          .pipe(tap(() => this.getCurrentUserProfile()))
          .subscribe();
      }
    });
  }

  setDefaultAccount(accountId) {
    return this.http.get(`${this.endPoint}/${this.tenant}/${accountId}`);
  }
}
