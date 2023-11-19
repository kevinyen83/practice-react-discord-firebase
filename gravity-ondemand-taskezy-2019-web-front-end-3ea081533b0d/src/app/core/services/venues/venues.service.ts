import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenuesService {

  venueForm: FormGroup;
  initHistory = false;
  history: any[] = [];
  compliances = [];
  currentVenue: any;
  updateLicences = new Subject<any>();
  addedMember = new Subject<boolean>();
  currentTab = new Subject<string>();
  // detailsForm: FormGroup;
  setErrors = new Subject<boolean>();
  inductions = [];
  criteries = [];
  resources = [];
  // creatingVenue: any;
  _members = new BehaviorSubject([]);
  resourcesBreakdown = [];
  historyIncidents = [];
  selectedLicences = [];
  selectedMembersIds = [];
  // _venues = new Subject<any[]>();

  // private endPointProfile = environment.apiUrlBusinessAccount;
  // private local = environment.e2e;

  constructor(private http: HttpClient) { }

  // get venues() {
  //   return this._venues.asObservable();
  // }

  // set venues(obj: any) {
  //   this._venues.next(obj);
  // }

  // get members() {
  //   return this._members.asObservable();
  // }

  // set members(obj: any) {
  //   this._members.next(obj);
  // }

  // getAllVenuesForClient(currentUuid, clientUuid) {
  //   if (clientUuid) {
  //     if (this.local) {
  //       return this.http.get(`${this.endPointVenues}/venue`);
  //     } else {
  //       return this.http.get(`${this.endPointVenues}/${currentUuid}/clients/${clientUuid}/venues`);
  //     }
  //   } else {
  //     return of([]);
  //   }
  // }

  // getAllVenuesForAllClients(currentUuid) {
  //   //TODO: get all clients for profile and flatmap all cleints and venues to single return
  //   if (currentUuid) {
  //     if (this.local) {
  //       return this.http.get(`${this.endPointVenues}`);
  //     } else {
  //       return this.http.get('api/venues');
  //     }
  //   } else {
  //     return of([]);
  //   }
  // }

  // getCurrentVenue(currentUuid, clientUuid, uuidVenue) {
  //   if (currentUuid) {
  //     if (this.local) {
  //       return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
  //         map((res: any) => res.venues.find(venue => venue.uuid === uuidVenue))
  //       );
  //     } else {
  //       return this.http.get(`${this.endPointProfile}/${currentUuid}/clients/${clientUuid}/venues/${uuidVenue}`);
  //     }
  //   } else {
  //     return of([]);
  //   }
  // }

  // addVenue(currentUuid, clientUuid, venue): Observable<any> {
  //   if (this.local) {
  //     return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
  //       switchMap((res: any) => {
  //         venue.id = venue.uuid = parseInt(Math.random().toString().slice(2,11), 10);
  //         res.suppliers.push(venue);
  //         return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
  //       }),
  //       switchMap(() => of(venue))
  //     );
  //   } else {
  //     return this.http.post(`${this.endPointProfile}/${currentUuid}/clients/${clientUuid}/venues`, venue).pipe(
  //       catchError(err => of(err))
  //     );
  //   }
  // }

  // updateVenue(currentUuid, clientUuid, uuidVenue, venue): Observable<any> {
  //   if (this.local) {
  //     return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
  //       switchMap((res: any) => {
  //         // find document to be replaced and replace it
  //         const replacingInd = res.venues.findIndex(ven => ven.uuid === uuidVenue);
  //         res.venues[replacingInd] = venue;
  //         return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
  //       }),
  //       switchMap(() => of(venue))
  //     );
  //   } else {
  //     return this.http.put(`${this.endPointProfile}/${currentUuid}/clients/${clientUuid}/venues/${uuidVenue}`, venue);
  //   }
  // }

  // getMembers() {
  //   return this.http.get('api/members').pipe(
  //     tap((res) => {
  //       this.members = res;
  //     })
  //   );
  // }
}

