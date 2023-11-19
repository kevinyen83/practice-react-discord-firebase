import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { Observable, BehaviorSubject, of, Subject, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  creatingClient: any = {};
  venueForm: FormGroup;
  detailsForm: FormGroup;
  avatar: any;
  setErrors = new Subject<boolean>();
  contactForm: FormGroup;
  editedContact = new Subject<boolean>();
  changeSelectedIndex: number;
  // currentClients = [];
  statusManagers: string = 'unselect';
  // fakeClients: any = [];
  venues = [];
  abnInfo = {};
  _contacts = new BehaviorSubject<any[]>([]);
  // _clients = new BehaviorSubject<any[]>([]);

  private endPointProfile = environment.apiUrlBusinessAccount;
  private local = environment.e2e;

  constructor(private http: HttpClient) {}

  // get clients() {
  //   return this._clients.asObservable();
  // }
  // set clients(obj: any) {
  //   this._clients.next(obj);
  // }
  get contacts() {
    return this._contacts.asObservable();
  }
  set contacts(obj: any) {
    this._contacts.next(obj);
  }
  // getClients(currentUuid) {
  //   if (currentUuid) {
  //     if (this.local) {
  //       this.http
  //         .get(`${this.endPointProfile}/${currentUuid}`)
  //         .pipe(
  //           map((res: any) => {
  //             this.clients = res.clients;
  //             // return res.clients;
  //           })
  //         )
  //         .subscribe();
  //     } else {
  //         this.http.get(`${this.endPointProfile}/${currentUuid}/clients`)
  //         .pipe(
  //           tap((res: any) => {
  //             if (!res) {
  //               res = [];
  //             }
  //             this.clients = res;
  //             // if (res[0] && res[1]) {
  //             //   this.clients = [...res[0], ...res[1]];
  //             // }
  //             // this.clients = res;
  //             // this.clients = clients.map(cln=> {
  //             //   cln.venue = [];
  //             //   return cln
  //             // });
  //           })
  //         )
  //         .subscribe();
  //     }
  //   } else {
  //     this.clients = [];
  //   }
  // }

  // getFakeClients() {
  //   this.http.get('api/clients').subscribe(res => {
  //     this.fakeClients = res;
  //   });
  // }

  getCurrentClient(currentUuid, uuidClient): Observable<any> {
    if (currentUuid) {
      if (this.local) {
        return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
          map((res: any) => res.clients.find((client) => client.uuid === uuidClient))
        );
      } else {
        return this.http
          .get(`${this.endPointProfile}/${currentUuid}/clients/${uuidClient}`);
          // .pipe(
          //   map((res: any) =>
          //     // // TODO: Remove when Venues implememnted
          //     // res.venue = [];
          //      res
          //   )
          // );
      }
    } else {
      return of([]);
    }
  }

  addClient(currentUuid, client): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          client.id = client.uuid = parseInt(Math.random().toString().slice(2,11), 10);
          res.clients.push(client);
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        }),
        switchMap(() => of(client))
      );
    } else {
      return this.http.post(
        `${this.endPointProfile}/${currentUuid}/clients`,
        client
      );
    }
  }

  updateClient(currentUuid, uuidClient, client): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          // find document to be replaced and replace it
          const replacingInd = res.clients.findIndex(
            (sup) => sup.uuid === uuidClient
          );
          res.clients[replacingInd] = client;
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        }),
        switchMap(() => of(client))
      );
    } else {
      return this.http.put(
        `${this.endPointProfile}/${currentUuid}/clients/${uuidClient}`,
        client
      );
    }
  }

  searchClients(items, searchText) {
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

  getContacts(): Observable<any> {
    return this.http.get('api/contacts').pipe(
      tap((res) => {
        this.contacts = res;
      })
    );
  }

  postContact(contacts): Observable<any> {
    return this.http
      .post('api/contacts', {
        id: 'contacts',
        data: contacts,
      })
      .pipe(
        tap((res) => {
          this.contacts = contacts;
        })
      );
  }

  // cleanUp() {
  //   this.clients = [];
  // }
}
