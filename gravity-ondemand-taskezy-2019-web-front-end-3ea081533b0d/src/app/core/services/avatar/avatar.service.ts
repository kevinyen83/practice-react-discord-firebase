import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {map, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  _defaultAvatar = 'assets/images/person.icons.svg';

  private local = environment.e2e;

  constructor(private http: HttpClient) {}

  get defaultAvatar(): string {
    return this._defaultAvatar;
  }

  uploadAvatar(formData) {
    return this.http.post(`${environment.apiUrlFiles}/avatar`, formData).pipe(
      map((res: any) => {
        res.filename += '?' + Date.now();
        return res;
      })
    );
  }

  uploadLogo(formData, id) {
    if (this.local) {
      let res = {
        filename: 'new-logo'
      };
      res.filename += '?' + Date.now();
      return of(res);
    } else {
      return this.http.post(`${environment.apiUrlFiles}/logo/${id}`, formData).pipe(
        map((res: any) => {
          res.filename += '?' + Date.now();
          return res;
        })
      );
    }
  }

  // saveAvatarCloudinary(filename, imageB64) {

  //   const body = {
  //     upload_preset: environment.cloudinary.avatarPreset,
  //     fileName: filename,
  //     file: imageB64
  //   };

  //   return fetch(environment.cloudinary.uri, {
  //     method: 'post',
  //     headers: {
  //       'Content-type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   });
  // }
}
