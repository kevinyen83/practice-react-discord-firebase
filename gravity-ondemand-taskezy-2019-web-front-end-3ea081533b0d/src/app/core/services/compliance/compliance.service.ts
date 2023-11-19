import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ComplianceService {
  // accreditations = new BehaviorSubject<any[]>([]);
  detailsForm: FormGroup;
  private local = environment.e2e;
  private endPointProfile = environment.apiUrlBusinessAccount;
  private endPointCompliance = environment.apiUrlCompliance;

  constructor(private http: HttpClient) { }

  getAccreditations(currentUuid): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        map((res: any) => res.accreditation)
      );
    } else {
      return this.http.get(`${this.endPointProfile}/${currentUuid}/accreditation`);
    }
  }

  updateAccreditations(currentUuid, accreditation): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          res.accreditation = accreditation;
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        })
      );
    } else {
      return this.http.put(`${this.endPointProfile}/${currentUuid}/accreditation`, accreditation);
    }
  }

  verifyComplianceDetails(apiSlug, identifier): Observable<any> {
    /* Type can be a single string that is seperated by / for multiple parts
    *  eg    abn             to check only abn
    *        security/nsw    to check nsw security licence
    */
      if (this.local) {
        // need to check what the format returned is so we can direct to local fakedb
        const adjustedApiSlug = apiSlug.replace('/', '-');

        return this.http.get(`api/compliance-${adjustedApiSlug}/${identifier}`);
      } else {
        // api retured by accreditaion details is used to check
        return this.http.get(`${this.endPointCompliance}/${apiSlug}/${identifier}`);
      }
  }

  checkAccreditation(): Observable<any> {
    if (this.local) {
      return this.http.get('api/list-accreditations');
    } else {
      return this.http.get(`${this.endPointCompliance}/accreditation`);
    }
  }

  checkNSWLicence(licence): Observable<any> {
    if(this.local) {
      // return this.http.get(`api/liquor/nsw/${licence}`);
    } else {
      return this.http.get(`${this.endPointCompliance}/liquor/nsw/${licence}`)
    }
  }
}
