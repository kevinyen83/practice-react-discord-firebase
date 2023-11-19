import { Injectable } from '@angular/core';

import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  statistics = [];
  disabledItems = [];
  activeLinks = new BehaviorSubject<any[]>(['Details']);
  currentNameProfile = new Subject<string>();

  constructor() { }
}
