import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  _members = new BehaviorSubject<any>([]);
  // invitedMembers = new Subject<number>();
  // countInvite: number = 0;

  constructor() {}

  get members() {
    return this._members.asObservable();
  }

  set members(obj) {
    this._members.next(obj);
  }
}
