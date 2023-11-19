import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  // clickedId = new Subject<any>();
  // _allShifts = new BehaviorSubject<any[]>([]);
  _currentShift = new BehaviorSubject<any>({});
  changedFilter = new Subject<any>();
  openedClients = [];
  openedVenues = [];
  allShifts = [];
  shiftData: any;
  selectedFilters = {};
  selectedShifts = {};
  events = [];
  selectedStatuses = [];
  selectedNameResult: any = {};

  // releaseClient = new BehaviorSubject<any>({});
  // selectedLicences = new Subject<any>();
  // confirmedLicences = [];

  // statusClickedEvents = new Subject<number>();
  _currentViewDate = new BehaviorSubject<Date>(new Date());

  // year;
  // week;

  releaseStatus = [
    { value: 0, label: 'Unreleased', colour: 'bg-zinc-400' },
    { value: 1, label: 'Released', colour: 'bg-warning' },
    { value: 2, label: 'Accepted', colour: 'bg-success' },
    { value: 3, label: 'Declined', colour: 'bg-danger' }
  ];

  private endPointRoster = environment.apiUrlRoster;
  private local = environment.e2e;

  constructor(private http: HttpClient) {}

  // get allShifts() {
  //   return this._allShifts.asObservable();
  // }

  get currentShift() {
    return this._currentShift;
  }
  get currentViewDate() {
    return this._currentViewDate.asObservable();
  }

  // set allShifts(obj: any) {
  //   this._allShifts.next(obj);
  // }
  set currentShift(obj: any) {
    this._currentShift.next(obj);
  }
  set currentViewDate(obj: any) {
    this._currentViewDate.next(obj);
  }

  createTask(shift, task, roles?, resources?) {
    if (this.local) {
      let role = roles?.find(r => r.uuid === task.role_uuid);
      let resource = resources?.find(r => r.user_id === task?.resource_uuid);
      task.role = role || {};
      task.resource = resource;
      shift.tasks.push(task);
      return this.http.put(`api/roster-tasks/${shift.uuid}`, shift);
    } else {
      return this.http.post(`${this.endPointRoster}/task/${shift.uuid}`, task).pipe(
        switchMap((res: any) => {
          return this.getShift(res?.shift_uuid);
        })
      );
    }
  }

  updateTask(taskUUID, task) {
    return this.http.put(`${this.endPointRoster}/task/${taskUUID}`, task);
  }

  deleteTask(taskUUID, shift) {
    if (this.local) {
      shift.id = shift.uuid;
      shift.tasks = [];
      return this.http.put(`api/roster-tasks/${shift.uuid}`, shift);
    } else {
      return this.http.delete(`${this.endPointRoster}/task/${taskUUID}`);
    }
  }

  getShift(uuid): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointRoster}/${uuid}`);
    } else {
      return this.http.get(`${this.endPointRoster}/shift/${uuid}`);
    }
  }

  createShift(accountUuid, shift) {
    if (this.local) {
      shift['id'] = (Math.floor(Math.random() * 90000) + 10000).toString();
      shift['uuid'] = shift.id;

      let tasks = shift.tasks;
      shift.release_status = 1;
      shift.venue = {
        "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Irish Pub",
        "address": {
            "street_location": "Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal",
            "geolocation": {
                "type": "Point",
                "coordinates": [
                    -105.7463,
                    38.797222
                ]
            },
            "google-call": "",
            "google-place-id": ""
        },
        "roles": [],
        "stations": []
    };
      shift.tasks = tasks.map(() => {

        return {
          "assessments": [],
          "datetime": moment().format(),
          "duration": 90,
          "role": {
              "uuid": "e359bcee-26b4-45c2-b026-f917dd4d5672",
              "name": "guard 2",
              "item_code": "",
              "description": "guardy guard",
              "rates": [
                  {
                      "name": "Standard",
                      "value": 12.5
                  },
                  {
                      "name": "Premium",
                      "value": 25.5
                  },
                  {
                      "name": "Discount",
                      "value": 45.5
                  }
              ],
              "credentials": []
          },
          "supervisor": false,
          "supplier": {
              "uuid": "7890789078907890",
              "name": "Jack Allon",
              "release_status": 1
          },
          "resource": {
              "uuid": "123456",
              "name": "Trevino Marvel",
              "release_status": 2
          },
          "timesheet": {
              "breaks": [
                  {
                      "datetime": "2023-01-24T14:00:00.000Z",
                      "duration": 3,
                      "geolocation": {
                          "type": "",
                          "coordinates": null
                      },
                      "signature": "",
                      "userId": "c74c3a11-8399-413a-89d0-40492e8531e1"
                  }
              ],
              "signoff": {
                  "datetime": "2023-01-25T18:48:12+11:00",
                  "geolocation": {
                      "type": "",
                      "coordinates": null
                  },
                  "signature": "",
                  "userId": "c74c3a11-8399-413a-89d0-40492e8531e1"
              },
              "signon": {
                  "datetime": "2023-01-25T15:48:12+11:00",
                  "geolocation": {
                      "type": "",
                      "coordinates": null
                  },
                  "signature": "",
                  "userId": "c74c3a11-8399-413a-89d0-40492e8531e1"
              }
          }
      };
      });
      return this.http.post('api/roster-tasks', shift);
    } else {
      return this.http.post(`${this.endPointRoster}/shift`, shift).pipe(catchError((err) => err.error));
    }
  }

  deleteShift(accountUuid, shift): Observable<any> {
    if (shift && shift.uuid.length < 8) {
      return this.http.delete(`api/roster-shifts/${shift.uuid}`).pipe(
        tap((res) => {
          // TODO:will be uncommented after server update
          // this.getAllShiftsByWeek();
        })
      );
    } else {
      return this.http.delete(`${this.endPointRoster}/shift/${shift.uuid}`, {
        responseType: 'text'
      });
    }
  }

  updateShift(accountUuid, shift): Observable<any> {
    if (this.local) {
      shift.id = shift.uuid;
      shift.client_status = 0;
      shift.supplier_status = 0;
      shift.resource_status = 0;
      return this.http.post(`api/roster-tasks/${shift.uuid}`, shift);
    } else {
      return this.http.put(`${this.endPointRoster}/shift/${shift.uuid}`, shift);
    }
  }

  getShiftsForPrimaryAccount(accountUuid): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointRoster}`);
    } else {
      return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}`);
    }
  }

  getShiftsForPrimaryAccountWithParams(accountUuid?, viewAs?, year?, month?, week?, formType?): Observable<any> {
    const params: any = {};
    if (accountUuid) {
      params.account = accountUuid.toString();
    }
    if (viewAs?.value) {
      params.type = viewAs.value.toString();
    }
    if (year) {
      params.year = year.toString();
    }
    if (month) {
      params.month = month.toString();
    }
    if (week) {
      params.week = week.toString();
    }
    if (formType) {
      params.form = formType.toString();
    }
    if (this.local) {
      return this.http.get(`${this.endPointRoster}`);
    } else {
      return this.http.get(`${this.endPointRoster}/shifts`, { params });
    }
  }

  acceptShiftAsTheClient(shiftUUID) {
    if (this.local) {
      return this.http.get(`${this.endPointRoster}/${shiftUUID}`).pipe(
        switchMap((res: any) => {
          res.client_status = 1;
          return this.http.put(`${this.endPointRoster}/${shiftUUID}`, res);
        })
      );
    } else {
      return this.http.put(`${this.endPointRoster}/client/shifts/accept/${shiftUUID}`, {});
    }
  }

  declineShiftAsTheClient(shiftUUID) {
    if (this.local) {
      return this.http.get(`${this.endPointRoster}/${shiftUUID}`).pipe(
        switchMap((res: any) => {
          res.client_status = 2;
          return this.http.put(`${this.endPointRoster}/${shiftUUID}`, res);
        })
      );
    } else {
      return this.http.put(`${this.endPointRoster}/client/shifts/decline/${shiftUUID}`, {});
    }
  }

  getShiftsForSupplierAccount(accountUuid, supplierUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/supplier/${supplierUuid}`);
  }

  getShiftsForSupplierAccountWithYear(accountUuid, supplierUuid, year): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/supplier/${supplierUuid}/${year}`);
  }

  getShiftsForSupplierAccountWithYearAndWeek(accountUuid, supplierUuid, year, week) {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/supplier/${supplierUuid}/${year}/${week}`);
  }

  getShiftsForResource(accountUuid, resourceUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/resource/${resourceUuid}`);
  }

  getShiftsForResourceWithYear(accountUuid, resourceUuid, year): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/resource/${resourceUuid}/${year}`);
  }

  getShiftsForResourceWithYearAndWeek(accountUuid, resourceUuid, year, week) {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/resource/${resourceUuid}/${year}/${week}`);
  }

  getShiftsForClientAccount(accountUuid, clientUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/client/${clientUuid}`);
  }

  getShiftsForClientAccountWithYear(accountUuid, clientUuid, year): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/client/${clientUuid}/${year}`);
  }

  getShiftsForClientAccountWithYearAndWeek(accountUuid, clientUuid, year, week) {
    return this.http.get(`${this.endPointRoster}/shifts/${accountUuid}/client/${clientUuid}/${year}/${week}`);
  }

  changeStatusClient(accountUuid, shift, status): Observable<any> {
    const params = { status };
    return this.http.put(`${this.endPointRoster}/status/${shift.uuid}/client`, {}, { params });
  }

  changeStatusSupplier(accountUuid, task, statusParam, shift): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPointRoster}/${shift.uuid}`).pipe(
        switchMap((res: any) => {
          if (res) {
            let currTask = res?.tasks?.find(t => t?.uuid === task?.uuid);
            let index = res?.tasks.findIndex(t => t.uuid === task.uuid);
            currTask.supplier.release_status = statusParam;
            res.tasks.splice(index, 1, currTask)
            return this.http.put(`${this.endPointRoster}/${shift.uuid}`, res);
          }
        }),
        tap(res => {
          this.currentShift.next(res);
        })
      )
    } else {
      const status = parseInt(statusParam, 10);
      const params = { status };
      return this.http.put(`${this.endPointRoster}/status/${task.uuid}/supplier`, {}, { params });
    }
  }

  updateTaskWithTheSpecificResource(task, resource) {
    return this.http.put(`${this.endPointRoster}/task/${task.uuid}/resource/${resource.user_id}`, {});
  }

  changeStatusResource(task, status): Observable<any> {
    const params = { status };
    return this.http.put(`${this.endPointRoster}/status/${task.uuid}/resource`, {}, { params });
  }

  releaseShift(shift): Observable<any> {
    if (this.local) {
      let newShift = shift;
      newShift.release_status++;
      newShift.ok = true;
      return this.http.put(`${this.endPointRoster}/${newShift.uuid}`, newShift);
    } else {
      return this.http.put(`${this.endPointRoster}/release/${shift.uuid}`, {});
    }
  }

  toCurrentClient(uuid) {
    window.open(`/pages/list-clients/${uuid}`, '_blank');
  }

  toCurrentSupplier(uuid) {
    window.open(`/pages/list-suppliers/${uuid}`, '_blank');
  }

  toCurrentResource(uuid) {
    window.open(`/pages/list-resources/${uuid}`, '_blank');
  }

  getShiftFormDatas(shiftUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${shiftUuid}/formdata`);
  }
  getShiftFormData(shiftUuid, formdataUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/shifts/${shiftUuid}/formdata/${formdataUuid}`);
  }


  getTaskFormDatas(taskUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/tasks/${taskUuid}/formdata`);
  }
  getTaskFormData(taskUuid, formdataUuid): Observable<any> {
    return this.http.get(`${this.endPointRoster}/tasks/${taskUuid}/formdata/${formdataUuid}`);
  }

  cleanUp() {
    this.currentShift = {};
    // this.allShifts = [];
  }

  getBGColour(shift) {
    let val = 0;
    const vals = [];
    if (shift?.uuid) {
      // vals.push(shift.client_release_status);
      shift?.tasks.forEach((task) => {
        vals.push(task?.supplier?.release_status);
        vals.push(task?.resource?.release_status);
      });
      if (shift?.release_status > 0 && vals.includes(3)) {
        val = 3;
      } else if (shift?.release_status > 0 && (vals.includes(1) || vals.includes(undefined) || vals.includes(0))) {
        val = 1;
      } else if (shift?.release_status === 0) {
        val = 0;
      } else {
        val = 2;
      }
    }

    return this.releaseStatus[val].colour;
  }

  // Timesheet Register

  addCommentTask(taskUUID, comment) {
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/note`, comment);
  }

  deleteCommentTask(taskUUID, comment) {
    return this.http.delete(`${this.endPointRoster}/timesheet/${taskUUID}/note/${comment.uuid}`, { responseType: 'text' });
  }

  addAdditionalTime(taskUUID, additional) {
    return this.http.post(`${this.endPointRoster}/timesheet/${taskUUID}/additional`, additional);
  }

  getAdditionalTime(taskUUID, additionalUUID) {
    return this.http.get(`${this.endPointRoster}/timesheet/${taskUUID}/additional/${additionalUUID}`);
  }

  updateAdditionalTime(taskUUID, additionalUUID, additional) {
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/additional/${additionalUUID}`, additional);
  }

  deleteAdditionalTime(taskUUID, additionalUUID) {
    return this.http.delete(`${this.endPointRoster}/timesheet/${taskUUID}/additional/${additionalUUID}`, { responseType: 'text' });
  }

  getChallenge(taskUUID) {
    return this.http.get(`${this.endPointRoster}/timesheet/${taskUUID}/challenge`);
  }

  updateChallenge(taskUUID, challenge) {
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/challenge`, challenge);
  }

  addChallenge(taskUUID, challenge) {
    return this.http.post(`${this.endPointRoster}/timesheet/${taskUUID}/challenge`, challenge);
  }

  deleteChallenge(taskUUID) {
    return this.http.delete(`${this.endPointRoster}/timesheet/${taskUUID}/challenge`);
  }

  acceptChallenge(taskUUID, userUUID, field) {
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/challenge/${userUUID}`, field);
  }

  getSplit(taskUUID) {
    return this.http.get(`${this.endPointRoster}/timesheet/${taskUUID}/splits`);
  }

  addSplitTime(taskUUID, split) {
    return this.http.post(`${this.endPointRoster}/timesheet/${taskUUID}/splits`, split);
  }

  updateSplits(taskUUID, splitUUID, splits) {
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/splits/${splitUUID}`, splits);
  }

  deleteSplit(taskUUID, splitUUID) {
    return this.http.delete(`${this.endPointRoster}/timesheet/${taskUUID}/splits/${splitUUID}`, { responseType: 'text' });
  }

  setReconciledStatusTask(taskUUID) {
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/reconcile`, {});
  }

  updateSplitResult(task, result) {
    if (this.local) {
      task.timesheet.result = result;
      task.notes = [];
      task.notes.push({
        uuid: 'dte7teuyufzsefwe',
        datetime: moment(),
        author: 'daria'
      });
      return of(task.timesheet);
    } else {
      return this.http.put(`${this.endPointRoster}/timesheet/${task.uuid}/result/${result}`, result);
    }
  }

  splitsReplace(taskUUID, splits){
    return this.http.put(`${this.endPointRoster}/timesheet/${taskUUID}/splits-replace`, splits);
  }

  getStatus(status, user) {
    const statusMap = {
      0: 'Unreleased',
      1: 'Released',
      2: 'Accepted',
      3: 'Declined'
    }
    if (user === 'client') {
      statusMap[0] = 'Pending';
      statusMap[1] = 'Accepted';
      statusMap[2] = 'Declined';
    }
    return statusMap[status];
  }

  getStatusColor(status, user) {
    switch (status) {
      case 2:
        return user === 'client' ? 'bg-red-400' : 'bg-green-400';
      case 0:
        return user === 'client' ? 'bg-orange-400' : 'bg-slate-400';
      case 1:
        return user === 'client' ? 'bg-green-400' : 'bg-orange-400'
      case 3:
        return 'bg-red-400';
      default:
        return 'bg-orange-400';
    }
  }
}
