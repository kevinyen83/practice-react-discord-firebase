import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  resources;
  // _suppliers = new BehaviorSubject<any[]>([]);
  detailsForm: FormGroup;
  setErrors = new Subject<boolean>();
  abnInfo;

  private endPointProfile = environment.apiUrlBusinessAccount;
  private local = environment.e2e;

  constructor(private http: HttpClient) {}

  // get suppliers() {
  //   return this._suppliers.asObservable();
  // }
  // set suppliers(obj: any) {
  //   this._suppliers.next(obj);
  // }
  // getSuppliers(currentUuid?) {
  //   if (currentUuid) {
  //     if (this.local) {
  //       this.http
  //         .get(`${this.endPointProfile}/${currentUuid}`)
  //         .pipe(
  //           map((res: any) => {
  //             this.suppliers = res.suppliers;
  //           })
  //         )
  //         .subscribe();
  //     } else {
  //       this.http
  //         .get(`${this.endPointProfile}/${currentUuid}/suppliers`)
  //         .pipe(
  //           tap((res: any[]) => {
  //             if (!res) {
  //               res = [];
  //             }
  //             this.suppliers = res;
  //           })
  //         )
  //         .subscribe();
  //     }
  //   } else {
  //     this.suppliers = [];
  //   }
  // }

  getCurrentSupplier(currentUuid, uuidSupplier): Observable<any> {
    if (currentUuid) {
      if (this.local) {
        return this.http
          .get(`${this.endPointProfile}/${currentUuid}`)
          .pipe(
            map((res: any) =>
              res.suppliers.find((supplier) => supplier.uuid === uuidSupplier)
            )
          );
      } else {
        return this.http.get(
          `${this.endPointProfile}/${currentUuid}/suppliers/${uuidSupplier}`
        );
      }
    } else {
      return of([]);
    }
  }

  addSupplier(currentUuid, supplier): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          supplier.id = supplier.uuid = parseInt(Math.random().toString().slice(2,11), 10);
          res.suppliers.push(supplier);
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        }),
        switchMap(() => of(supplier))
      );
    } else {
      return this.http.post(
        `${this.endPointProfile}/${currentUuid}/suppliers`,
        supplier
      );
    }
  }

  updateSupplier(currentUuid, uuidSupplier, supplier): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          // find document to be replaced and replace it
          const replacingInd = res.suppliers.findIndex(
            (sup) => sup.uuid === uuidSupplier
          );
          res.suppliers[replacingInd] = supplier;
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        }),
        switchMap(() => of(supplier))
      );
    } else {
      return this.http.put(
        `${this.endPointProfile}/${currentUuid}/suppliers/${uuidSupplier}`,
        supplier
      );
    }
  }

  searchSuppliers(items, searchText) {
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
  //   this.suppliers = [];
  // }
}
