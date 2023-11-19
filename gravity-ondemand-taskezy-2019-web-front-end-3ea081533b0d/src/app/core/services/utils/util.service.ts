import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from 'environments/environment';
import { VERSION } from 'environments/version';
import { parse } from 'node-html-parser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  termsInnerHtml = new BehaviorSubject('');
  privacyInnerHtml = new BehaviorSubject('');
  versionOfApp = '';

  constructor() {
    this.getPrivacy();
    this.getTerms();
  }

  getVersionOfApp() {
    const version = `${VERSION.version}`;
    this.versionOfApp = version;
  }

  getTerms() {
    (async () => {
      const response = await fetch('https://www.taskezy.com/terms/');
      if (response.status === 200) {
        const text = await response.text();
        const parsedText = parse(text);
        // console.log(parsedText);
        this.termsInnerHtml.next(parsedText.querySelector('article > div > div > div > div > div > div').innerHTML);
      }
    })();
  }

  getPrivacy() {
    (async () => {
      const response = await fetch('https://www.taskezy.com/privacy/');
      if (response.status === 200) {
        const text = await response.text();
        const parsedText = parse(text);
        // console.log(parsedText);
        this.privacyInnerHtml.next(parsedText.querySelector('article > div > div > div > div > div > div').innerHTML);
      }
    })();
  }

  randomString(len) {
    const r = Math.random()
      .toString(36)
      .substring(len - 1);
    return r;
  }

  b64toBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  getEnv() {
    if (environment.production) {
      return 'prod';
    } else if (environment.stage) {
      return 'stage';
    } else if (environment.test) {
      return 'test';
    } else if (environment.dev) {
      return 'dev';
    } else {
      return 'e2e';
    }
  }

  getRole(role) {
    const roleMap = {
      0: 'Resource',
      1: 'Manager',
      2: 'Assistant',
      3: 'Administrator'
    };
    return roleMap[role] || 'External Manager';
  }

  getStatus(status, isInvite, isResource) {
    const statusMap = {
      0: 'Pending',
      1: 'Active',
      2: 'Inactive',
      3: 'Banned',
      4: 'Waiting for Approval',
      5: 'Failed',
      6: 'Verified',
      7: 'Declined'
    };
    if (isInvite || isResource) {
      return statusMap[status];
    } else {
      return status === 0 ? 'Active' : 'Inactive';
    }
  }

  getStatusColour(status, isInvite, isResource) {
    if (isInvite || isResource) {
      switch (status) {
        case 1:
          return 'bg-green-400';
        case 0:
        case 4:
        case 6:
          return 'bg-orange-400';
        case 2:
        case 3:
        case 5:
          return 'bg-red-400';
        default:
          return 'bg-orange-400';
      }
    } else {
      return status === 0 ? 'bg-green-400' : 'bg-red-400';
    }
  }

  abnValidator(): ValidatorFn {
    if (environment.e2e) {
      return (control: AbstractControl): ValidationErrors | null => null;
    }
    return (control: AbstractControl): ValidationErrors | null => {
      // prettier-ignore
      // eslint-disable-next-line
      const weights = [10,1,3,5,7,9,11,13,15,17,19];
      const cleanedABN = control.value?.replace(/\D/g, '') || '';
      let valid = false;
      if (cleanedABN.length === 11) {
        let sum = 0;
        weights.forEach((weight, ind) => {
          const digit = parseInt(cleanedABN[ind], 10) - (ind === 0 ? 1 : 0);
          sum += weight * digit;
        });
        valid = sum % 89 === 0;
      } else {
        valid = false;
      }

      return valid ? null : { invalid: true };
    };
  }
}
