import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccreditationService {
  endPointAccreditations = environment.apiUrlCompliance;
  local = environment.e2e;
  public accreditationWorkFlow = new BehaviorSubject<any>([]);
  private endPointAccount = environment.apiUrlBusinessAccount;

  constructor(private http: HttpClient) {
  }

  getAccreditationWorkFlow() {
    this.getWorkFlow().subscribe((data) => {
      this.accreditationWorkFlow.next(data);
    });
  }

  getWorkFlow(): Observable<any> {
    if (this.local) {
      return this.http.get(`api/compliance`);
    } else {
      return this.http.get(
        `${this.endPointAccreditations}/accreditation/resource`
      );
    }
  }

  getUserAccreditations(): Observable<any> {
    if (this.local) {
      // profile.accreditation.forEach((acc) => {
      //   if (!acc.uuid) {
      //     acc.uuid = _uuid();
      //   }
      // });
      // return this.http.get(`api/userprofile/${profile.uuid}`).pipe(
      //   switchMap((res: any) => {
      //     res.accreditation = profile.accreditation;
      //     return this.http.put(`api/userprofile/${profile.uuid}`, res);
      //   })
      // );
      return of([]);
    } else {
      return this.http.get(`${this.endPointAccount}/user/formdata`);
    }
  }

  getAccountAccreditations(accountUUID): Observable<any> {
    if (this.local) {
      // profile.accreditation.forEach((acc) => {
      //   if (!acc.uuid) {
      //     acc.uuid = _uuid();
      //   }
      // });
      // return this.http.get(`api/userprofile/${profile.uuid}`).pipe(
      //   switchMap((res: any) => {
      //     res.accreditation = profile.accreditation;
      //     return this.http.put(`api/userprofile/${profile.uuid}`, res);
      //   })
      // );
      return of([]);
    } else {
      return this.http.get(`${this.endPointAccount}/${accountUUID}/formdata`);
    }
  }

  deleteUserAccreditation(formID): Observable<any> {
    if(this.local) {

    } else {
      return this.http.delete(`${this.endPointAccount}/user/formdata/${formID}`)
    }
  }

  addUserAccreditation(accreditation): Observable<any> {
    if (this.local) {
      // profile.accreditation.forEach((acc) => {
      //   if (!acc.uuid) {
      //     acc.uuid = _uuid();
      //   }
      // });
      // return this.http.get(`api/userprofile/${profile.uuid}`).pipe(
      //   switchMap((res: any) => {
      //     res.accreditation = profile.accreditation;
      //     return this.http.put(`api/userprofile/${profile.uuid}`, res);
      //   })
      // );
    } else {
      return this.http.post(
        `${this.endPointAccount}/user/formdata`,
        accreditation
      );
    }
  }

  addAccountAccreditation(accreditation, accountUUID): Observable<any> {
    if (this.local) {
      // profile.accreditation.forEach((acc) => {
      //   if (!acc.uuid) {
      //     acc.uuid = _uuid();
      //   }
      // });
      // return this.http.get(`api/userprofile/${profile.uuid}`).pipe(
      //   switchMap((res: any) => {
      //     res.accreditation = profile.accreditation;
      //     return this.http.put(`api/userprofile/${profile.uuid}`, res);
      //   })
      // );
    } else {
      return this.http.post(
        `${this.endPointAccount}/${accountUUID}/formdata`,
        accreditation
      );
    }
  }

  verifyComplianceDetails(apiSlug, identifier): Observable<any> {
    if (this.local) {
      // need to check what the format returned is so we can direct to local fakedb
      const adjustedApiSlug = apiSlug.replace("/", "-");
      return this.http.get(`api/compliance-${adjustedApiSlug}/${identifier}`);
    } else {
      // api retured by accreditaion details is used to check
      return this.http.get(
        `${this.endPointAccreditations}/${apiSlug}/${identifier}`
      );
    }
  }
}
