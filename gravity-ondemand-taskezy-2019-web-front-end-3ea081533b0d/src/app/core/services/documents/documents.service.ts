import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

export const FILE_ACCESS_READ = 0;
export const FILE_ACCESS_WRITE = 1;
export const FILE_ACCESS_DELETE = 2;

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  // documents = new BehaviorSubject<any[]>([]);

  public text = '{ "text": "This is text file!}';
  private endPointProfile = environment.apiUrlBusinessAccount;
  private endPointFiles = environment.apiUrlFiles;
  private local = environment.e2e;

  constructor(private http: HttpClient) {
  }

  getDocuments(currentUuid) {
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        map((res: any) => res.documents)
      );
    } else {
      return this.http.get(`${this.endPointProfile}/${currentUuid}/documents`);
    }
  }

  getFilesUpload(data) {
    if (this.local) {
      let result = {
        filename: "2e7fc2da-f71b-49dc-88cf-bfaa0f474c99",
        private: true,
        size: 649957
      };
      return of(result);
      // const value = Object.fromEntries(data.entries());
      // return of(value);
      // return this.http.post(`${this.endPointFiles}`, {
      //   id: 122,
      //   blob: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8s1arHgAGVAI0ivsK8QAAAABJRU5ErkJggg=='
      // });
    } else {
      return this.http.post<Doco>(`${this.endPointFiles}/upload`, data);
    }
  }

  getFilesDownload(document) {
    if (this.local) {
      return this.http.get(`${this.endPointFiles}/123`).pipe(
        map((res: any) => this.b64toBlob(res.blob, 'image/png'))
      );
    } else {
      return this.http.get(`${this.endPointFiles}/download/${document}`, {responseType: 'blob'});
    }
  }

  updateDocuments(currentUuid, documents): Observable<any> {
    // console.log(currentUuid, documents);
    if (this.local) {
      return this.http.get(`${this.endPointProfile}/${currentUuid}`).pipe(
        switchMap((res: any) => {
          res.documents = documents;
          return this.http.put(`${this.endPointProfile}/${currentUuid}`, res);
        })
      );
    } else {
      return this.http.put(`${this.endPointProfile}/${currentUuid}/documents`, documents);
    }
  }

  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  handleAccessDocument(fileUUID, infor) {
    if (this.local) {
      return of(true);
    } else {
      return this.http.put(`${this.endPointFiles}/access/${fileUUID}`, infor);
    }
  }

  getMetaData(fileUUID) {
    return this.http.get(`${this.endPointFiles}/meta/${fileUUID}`);
  }
}

export interface Doco {
  filename: string;
  size: number;
  private: boolean;
}
