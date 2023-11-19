import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  detailsForm: FormGroup;
  setErrors = new Subject<boolean>();
  // invitedMembers = new Subject<number>();
  // countInvite: number = 0;
  _currentResource = new BehaviorSubject<any>({});
  // _resources = new BehaviorSubject<any[]>([]);

  private endPointProfile = environment.apiUrlBusinessAccount;
  private local = environment.e2e;

  constructor(private http: HttpClient) {}

  // get resources() {
  //   return this._resources.asObservable();
  // }
  // set resources(obj: any) {
  //   this._resources.next(obj);
  // }

  // getResources(currentUuid) {
  //   if (currentUuid) {
  //     if (this.local) {
  //       this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
  //         map((res: any) => {
  //           this.resources = res.resources;
  //         })
  //       ).subscribe();
  //     } else {
  //       this.http.get(`${this.endPointProfile}/${currentUuid}/resources`).pipe(
  //         tap((res) => {
  //           if (!res) {
  //             res = [];
  //           }
  //           this.resources = res;
  //         })
  //       ).subscribe();
  //     }
  //   } else {
  //     this.resources = [];
  //   }
  // }

  get currentResource() {
    return this._currentResource.asObservable();
  }

  set currentResource(obj) {
    this._currentResource.next(obj);
  }

  getCurrentResource(currentUuid, uuidResource): Observable<any> {
    if (currentUuid) {
      if (this.local) {
        return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(map((res: any) => res.resources.find((resource: any) => resource.uuid === uuidResource)));
      } else {
        return this.http.get(`${this.endPointProfile}/${currentUuid}/resources/${uuidResource}`);
      }
    } else {
      return of([]);
    }
  }

  deleteResource(resource): Observable<any> {
    return this.http.delete('api/resources', resource);
  }

  addResource(currentUuid, resource): Observable<any> {
    if (this.local) {
      resource.uuid = resource.id = parseInt(Math.random().toString().slice(2, 11), 10);
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          res.resources.push(resource);
          // this.resources = res.resources;
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        }),
        switchMap(() => of(resource))
      );
    } else {
      return this.http.post(`${this.endPointProfile}/${currentUuid}/resources`, resource);
    }
  }

  updateResource(currentUuid, uuidResource, resource): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          // find document to be replaced and replace it
          const replacingInd = res.resources.findIndex((sup: any) => sup.uuid === uuidResource);
          res.resources[replacingInd] = resource;
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        }),
        switchMap(() => of(resource))
      );
    } else {
      return this.http.put(`${this.endPointProfile}/${currentUuid}/resources/${uuidResource}`, resource);
    }
  }

  getResourcesRequirements(): Observable<any> {
    return this.http.get('api/resourcesRequirements');
  }

  getControlsForNSWSecurityLicence(): Observable<any> {
    return this.http.get('/api/controlsForNSWSecurityLicence');
  }

  getControlsForNSWResponsibleServiceOfAlcohol(): Observable<any> {
    return this.http.get('api/controlsForNSWResponsibleServiceOfAlcohol');
  }

  getControlsForVIKSecurityLicence(): Observable<any> {
    return this.http.get('api/controlsForVIKSecurityLicence');
  }

  getControlsForVICResponsibleServiceOfAlcohol(): Observable<any> {
    return this.http.get('api/controlsForVICResponsibleServiceOfAlcohol');
  }

  getControlsForQLDSecurityLicence(): Observable<any> {
    return this.http.get('api/controlsForQLDSecurityLicence');
  }

  getControlsForQLDResponsibleServiceOfAlcohol(): Observable<any> {
    return this.http.get('api/controlsForQLDResponsibleServiceOfAlcohol');
  }

  getControlsForWASecurityLicence(): Observable<any> {
    return this.http.get('api/controlsForWASecurityLicence');
  }

  getControlsForWAResponsibleServOfAlcohol(): Observable<any> {
    return this.http.get('api/controlsForWAResponsibleServOfAlcohol');
  }

  searchResources(items, searchText) {
    if (!items) {
      return [];
    }

    if (!searchText || searchText === '') {
      return items;
    }

    const data = items.filter((it) => {
      const dataJSON = JSON.stringify(it);
      return dataJSON.toLowerCase().includes(searchText.toLowerCase());
    });
    return data.slice();
  }

  // cleanUp() {
  //   this.resources = [];
  // }

  getRoles(): Observable<any> {
    return this.http.get('api/roles-resources');
  }

  // getInterviews(): Observable<any> {
  //   return this.http.get('api/interviews-resources');
  // }

  getInductions(): Observable<any> {
    return this.http.get('api/resource-inductions');
  }

  getResourceRates(): Observable<any> {
    return this.http.get('api/resource-rates');
  }

  getResourceAccreditations(): Observable<any> {
    return this.http.get('api/resource-accreditations');
  }

  searchResourcesCompliance(items, searchText): any[] {
    if (!items) {
      return [];
    }
    if (!searchText || searchText === '') {
      return items;
    }
    const data = items.filter(
      (it: any) =>
        it.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        it.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        it.gender.toLowerCase().includes(searchText.toLowerCase()) ||
        it.mobileNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        it.email.toLowerCase().includes(searchText.toLowerCase()) ||
        it.complianceIssues.toLowerCase().includes(searchText.toLowerCase())
    );
    return data.slice();
  }

  getInterviews(): Observable<any> {
    return this.http.get('/api/interviews-resources');
  }

  updateInterviews(interviews): any {
    return this.http
      .post('/api/interviews/interviews', {
        id: 'interviews',
        data: [...interviews]
      })
      .subscribe((res) => {
        this.getInterviews();
      });
  }
}
