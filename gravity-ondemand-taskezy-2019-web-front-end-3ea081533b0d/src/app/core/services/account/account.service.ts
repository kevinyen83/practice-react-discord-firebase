import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject, of, Subject, ReplaySubject, combineLatest, throwError } from 'rxjs';
import { tap, switchMap, finalize, catchError, filter, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserProfileService } from '../user-profile/user-profile.service';
import { FormGroup } from '@angular/forms';
import { Account } from 'app/core/services/account/account';
import { RosterService } from "../roster/roster.service";
import moment from "moment";
import { FuseConfirmationService } from "../../../../@fuse/services/confirmation";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  postAddress;
  primaryAddress;

  currentAccountIsSubscriber: boolean = false;

  _listAccounts = new ReplaySubject<any>();
  _currentAccount = new BehaviorSubject<any>({});
  
  _connectedVenues = new BehaviorSubject<any>([]);
  _connectedResources = new BehaviorSubject<any>([]);

  _invitations = new BehaviorSubject([]);
  _memberships = new BehaviorSubject([]);
  accountAdminArray = [];

  abnInfo: any;
  newAccount: any;
  userInfo: any;
  loginError = new Subject<any>();
  closedDrawer = new Subject<boolean>();
  currentTypePlane: string;
  _admins = new BehaviorSubject<any>([]);
  _shiftRoles = new BehaviorSubject<any>([]);
  currentAdmins = [];
  // updatedInvites = new Subject<any[]>();

  isAdmin: boolean;

  _errorStatus = new Subject<any>();

  _selectedAccount = new BehaviorSubject({
    detail: {},
    venues: [],
    resources: [],
    invitations: [],
    members: [],
    documents: []
  });
  _selectedVenue = new BehaviorSubject({
    uuid: '',
    type: '',
    name: '',
    stations: [],
    roles: [],
    resource_rates: [],
    managers: [],
    documents: [],
    accreditation_requirements: []
  });
  _selectedAccountStatus = new BehaviorSubject('');
  _accreditations = new BehaviorSubject([]);
  detailsForm: FormGroup;
  phoneForm: FormGroup;
  detailsInvalidFields = new Subject<string[]>();
  phoneNumber;

  isEditingAccount = true;
  pauseRefresh = false;
  accreditations = [];

  accountsCount = new ReplaySubject<number>(1);

  private endPoint = environment.apiUrlBusinessAccount;
  private local = environment.e2e;

  constructor(private http: HttpClient,
              private _fuseConfirmationService: FuseConfirmationService,
              private userProfileService: UserProfileService,
              private rosterService: RosterService) {}

  get currentAccount() {
    return this._currentAccount;
  }
  get selectedAccount() {
    return this._selectedAccount;
  }

  get selectedVenue() {
    return this._selectedVenue;
  }

  get connectedVenues() {
    return this._connectedVenues;
  }
  get connectedResources() {
    return this._connectedResources;
  }
  get selectedAccountStatus() {
    return this._selectedAccountStatus;
  }
  get admins() {
    return this._admins;
  }
  get listAccounts() {
    return this._listAccounts;
  }

  get invitations() {
    return this._invitations;
  }

  get memberships() {
    return this._memberships;
  }

  get shiftRoles() {
    return this._shiftRoles;
  }

  get detailAccreditations() {
    return this._accreditations;
  }

  set currentAccount(obj: any) {

    // this.currentAccountIsSubscriber = obj?.detail?.subscription?.plan?.plan_type === 'subscriber';
    this.currentAccountIsSubscriber = obj.payment_instruments.length > 0;
    // currently if they have a playment instrument we call them a subscriber. 
    // we can update this later when we have subscriptions running properly so be able to check.
    // every time the currentAccount is changed, we double check they still have an active subscription.
    console.log(obj);
    console.log('*(*(*(*(*(*(*(*I RAN AND IM*)*)*)*)*)*)*)*)', this.currentAccountIsSubscriber);
    this._currentAccount.next(obj);
  }

  set selectedAccount(obj: any) {
    this._selectedAccount.next(obj);
  }
  set selectedVenue(obj: any) {
    this._selectedVenue.next(obj);
  }
  set connectedVenues(obj: any) {
    this._connectedVenues.next(obj);
  }
  set connectedResources(obj: any) {
    this._connectedResources.next(obj);
  }
  set selectedAccountStatus(str: any) {
    this._selectedAccountStatus.next(str);
  }
  set listAccounts(obj: any) {
    this._listAccounts.next(obj);
  }
  set admins(obj: any) {
    this._admins.next(obj);
  }

  set invitations(obj: any) {
    this._invitations.next(obj);
  }

  set memberships(obj: any) {
    this._memberships.next(obj);
  }

  set shiftRoles(obj: any) {
    this._shiftRoles.next(obj);
  }

  set detailAccreditations(array: any) {
    this._accreditations.next(array);
  }

  // get errorStatus() {
  //   return this._errorStatus.asObservable();
  // }

  // set errorStatus(obj) {
  //   this._errorStatus.next(obj);
  // }

  getConnections() {
    this.http.get(`${this.endPoint}/connections`).pipe(
      tap(res => {

      })
    ).subscribe();
  }

  addConnection(connection) {
    return this.http.put(`${this.endPoint}/connections/account`, connection);
  }

  resetSelectedAccount(status) {
    this.selectedAccountStatus = status;
    this.selectedAccount = {
      detail: {},
      venues: [],
      resources: [],
      invitations: [],
      members: [],
      documents: []
    };
  }

  setPauseRefresh(pause) {
    this.pauseRefresh = pause;
  }

  refreshCurrentAccount() {
    this.setCurrentAccount(this.currentAccount.getValue().uuid).subscribe();
  }

  regularRefreshCurrentAccount() {
    if(!this.pauseRefresh || environment.e2e) {
      this.setCurrentAccount(this.currentAccount.getValue().uuid).subscribe();
    }
  }

  setCurrentAccount(uuid) {
    console.log('set current account', uuid);
    if (uuid) {
      // this.invitationsService.getListInvites(uuid);
      return this.getAccountInformation(uuid).pipe(
        tap((res: any) => {
          let oldAccount = this.currentAccount.getValue();
          if (uuid !== oldAccount.uuid) {
            this.rosterService.selectedFilters = {};
            this.rosterService.selectedShifts = {};
          }
          localStorage.setItem('currentAccount', uuid);
          this.currentAccount = res;
          // if (this.local) {
          //   this.accountsCount.next(res.accountsCount);
          // }
          // this.clientsService.getClients(res.uuid);
          // this.resourcesService.getResources(res.uuid);
          // this.suppliersService.getSuppliers(res.uuid);
          /// set account to defaultAccount for user.
          console.log('settedCurrentAccount:', res);
        })
      );
    }
    //   else {
    //   // of({});
    // }
  }

  getDetail(uuid): Observable<any> {
    if (uuid) {
      if (this.local) {
        return this.http.get(`${this.endPoint}/${uuid}`).pipe(switchMap((res: any) => of(res.detail)));
      } else {
        return this.http.get(`${this.endPoint}/${uuid}/detail`);
      }
    } else {
      of({});
    }
  }

  updateDetail(uuid, detail): Observable<any> {
    if (this.local) {
      return this.http.get(`${this.endPoint}/${uuid}`).pipe(
        switchMap((res: any) => {
          res.detail = detail;
          return this.http.put(`${this.endPoint}/${uuid}`, res);
        })
      );
    } else {
      return this.http.put(`${this.endPoint}/${uuid}/detail`, detail);
    }
  }

  amIAdmin(accountUUID) {
    return this.accountAdminArray.includes(accountUUID);
  }

  cleanUp() {
    // this.listAccounts = [];
    // this.currentAccount = {};
    this.accountAdminArray = [];
    this.currentAdmins = [];

    this._listAccounts.complete();
    this._listAccounts = new ReplaySubject<any>();

    this._currentAccount.complete();
    this._currentAccount = new BehaviorSubject<any>({});

    this._connectedVenues.complete();
    this._connectedVenues = new BehaviorSubject<any>([]);
    this._connectedResources.complete();
    this._connectedResources = new BehaviorSubject<any>([]);

    this._invitations.complete();
    this._invitations = new BehaviorSubject([]);

    this._selectedAccount.complete();
    this._selectedAccount = new BehaviorSubject({
      detail: {},
      venues: [],
      resources: [],
      invitations: [],
      members: [],
      documents: []
    });

    this._selectedVenue.complete();
    this._selectedVenue = new BehaviorSubject({
      uuid: '',
      type: '',
      name: '',
      stations: [],
      roles: [],
      resource_rates: [],
      managers: [],
      documents: [],
      accreditation_requirements: []
    });
    this._selectedAccountStatus.complete();
    this._selectedAccountStatus = new BehaviorSubject('');

    this._accreditations.complete();
    this._accreditations = new BehaviorSubject([]);
    this._admins.complete();
    this._admins = new BehaviorSubject([]);
  }

  getPlanesMonth() {
    return this.http.get('api/planesMonth');
  }

  getPlanesYear() {
    return this.http.get('api/planesYear');
  }

  checkout(amount) {
    this.http
      .post('/create-checkout-session', {})
      // .pipe(
      //   switchMap(session => {
      //     return this.stripeService.redirectToCheckout({ sessionId: session['id'] })
      //   })
      // )
      .subscribe((result) => {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result && result['error']) {
          alert(result['error'].message);
        }
      });
  }

  getAdmins(uuid) {
    if (this.local) {
      this.http
        .get('/api/admins')
        .pipe(
          tap((res) => {
            this.admins = res;
            this.checkIsAdmin(res);
          })
        )
        .subscribe();
    } else {
      // this.http.get(`${this.endPoint}/${uuid}/admins`).pipe(
      this.http
        .get(`${this.endPoint}/list`)
        .pipe(
          ///TODO: list gets us a list of accounts, need to get the members of the account and then filter the admins (level 4)
          tap((res) => {
            this.admins = res;
            this.checkIsAdmin(res);
          })
        )
        .subscribe();
    }
  }

  checkIsAdmin(admins) {
    const user: any = this.userProfileService._currentUser.getValue();
    if (user && user?.id) {
      this.isAdmin = admins?.some((admin) => admin?.uuid?.toString() === user?.id.toString());
    }
  }

  ///////////////////////// NEW API END POINTS FOR WHEN WE SWAP /////////////////////////

  // USER RELATED ACCOUNT METHODS
  getMyAccountInvitesOld() {
    if (this.local) {
      combineLatest([
        this.http.get('api/invitations'),
        this.http.get('api/external-invitations')])
        .pipe(
          tap((res: any[]) => {
            this.invitations = [
              ...res[0],
              ...res[1].supplier_invitations.map((sup) => {
                sup.sub_account_type = 'Supplier';
                return sup;
              }),
              ...res[1].client_invitations.map((cli) => {
                cli.sub_account_type = 'Client';
                return cli;
              })

            ];
          })
        )
        .subscribe();
    } else {
      combineLatest([
        this.http.get(`${this.endPoint}/invite`),
        this.http.get(`${this.endPoint}/invite-external`)])
        .pipe(
          tap((res: any[]) => {
            this.invitations = [
              ...res[0],
              ...res[1].supplier_invitations.map((sup) => sup.sub_account_type = 'Supplier'),
              ...res[1].client_invitations.map((cli) => {
                cli.sub_account_type = 'Client';
                return cli;
              })

            ];
          })
        )
        .subscribe();
    }
  }

  getAlertForCreateAccount() {
    const dialogRef = this._fuseConfirmationService.open({
      title: 'Create New Account',
      message: '<p>Thank you for your interest in creating a new business account with our company. We appreciate your decision to join our network and look forward to serving your business needs.</p><br/>' +
        '<p>To initiate the process of setting up a new business account, we kindly request that you reach out to us via support@taskezy.com. This will allow us to gather the necessary information and guide you through the account creation procedure in a streamlined manner.</p><br/>' +
        '<p>We\'re excited to embark on this journey with you. We look forward to receiving your email, and our team will be in touch with you shortly.</p>',
      icon: {
        show: true,
        name: 'heroicons_outline:user',
        color: "accent"
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ok',
          color: 'primary'
        },
        cancel: {
          show: false,
          label: 'Cancel'
        }
      },
      dismissible: false
    });
  }

  getMyAccountInvites() {
    if (this.local) {
      combineLatest([
        this.http.get('api/invitations')])
        .pipe(
          tap((res: any[]) => {
            this.invitations = [
              ...res[0],
            ];
          })
        )
        .subscribe();
    } else {
      this.http.get(`${this.endPoint}/connections`).pipe(
        tap((res: any) => {
          this.invitations = [
            ...res.invitations.filter((item) => item.status !== "Active"),
            ...res.external_manage_invitations.filter(
              (item) => item.status !== "Active"
            ),
          ]

          this.memberships = res.memberships;
        })
      ).subscribe();
    }
  }

  acceptMyAccountInvite(invite) {
    if (this.local) {
      return this.http.delete(`api/invitations/${invite.id}`);
    } else {
      return this.http.put(`${this.endPoint}/invite/accept/${invite.account_id}`, {});
    }
  }

  declineMyAccountInvite(invite) {
    if (this.local) {
      return this.http.delete(`api/invitations/${invite.id}`);
    } else {
      return this.http.put(`${this.endPoint}/invite/decline/${invite.account_id}`, {});
    }
  }

  getMyAccountExternalManageInvites() {
    if (this.local) {
      // return this.http.get('api/external-invitations');
      return this.currentAccount.pipe(switchMap((res: any) => of(res?.externalInvites)));
    } else {
      return this.http.get(`${this.endPoint}/invite-external`);
    }
  }

  acceptMyAccountExternalManageInvite(invite) {
    if (this.local) {
      return this.http.delete(`api/invitations/${invite.id}`);
    } else {
      return this.http.put(`${this.endPoint}/invite-external/accept/start/${invite.invite_id}`, {});
    }
  }

  confirmMyAccountExternalManageInvite(invite) {
    if (this.local) {
      return this.http.delete(`api/invitations/${invite.id}`);
    } else {
      return this.http.put(`${this.endPoint}/invite-external/accept/end/${invite.invite_id}`, {});
    }
  }

  declineMyAccountExternalManageInvite(invite) {
    if (this.local) {
      return this.http.delete(`api/invitations/${invite.id}`);
    } else {
      return this.http.put(`${this.endPoint}/invite-external/decline/${invite.invite_id}`, {});
    }
  }

  isAccountExistsInTheSystem(abn) {
    if (this.local) {
      return this.http.get(`${this.endPoint}/${abn}`, { observe: 'response' }).pipe(
        map((res: any) => {
          res.status = 204;
          return res;
        }),
        catchError((err) => {
          err.status = 206;
          err.statusText = 'not used brah';
          return of(err);
        })
      );
    } else {
      return this.http.get(`${this.endPoint}/abn/${abn}`, { observe: 'response' });
    }
  }

  getAllConnections() {
    return this.http.get(`${this.endPoint}/connections`);
  }

  getAllAccounts() {
    console.log('this.getAllAccounts called');
    // return this.http.get(`${this.endPoint}/list`);
    const user_id = localStorage.getItem('user_id');
    if (this.local) {
      return this.http.get(`${this.endPoint}`).pipe(
        switchMap((res: any) => {
          if (user_id === '11111111') {
            const filtered = res.filter((acnt: any) => acnt.members.filter((mem: any) => mem.user_id.toString() === user_id && mem.role > 0).length > 0);
            this.listAccounts = filtered;
            this.accountsCount.next(filtered.length);
            this.accountAdminArray = filtered.map((acn) => acn.uuid);
          } else {
            this.listAccounts = [];
            this.accountsCount.next(0);
            this.accountAdminArray = [];
          }
          return this.listAccounts;
        })
      );
    } else {
      return this.http.get(`${this.endPoint}/list`).pipe(
        switchMap((res: any) => {
          console.log(user_id);
          console.log('list res', res);
          const filtered = res.filter((acnt: any) => acnt.members.filter((mem: any) => mem.user_id === user_id && mem.role > 0).length > 0);
          console.log('fil:', filtered);
          this.listAccounts = filtered;
          this.accountsCount.next(filtered.length);
          this.accountAdminArray = filtered.map((acn) => acn.uuid);
          return of(filtered);
        }),
        catchError((error) => {
          if (error.status === 404) {
            // handle 404 error
            console.log('Error 404: Not Found');
            // If you want to return an empty array when a 404 occurs:
            this.listAccounts = [];
            this.accountsCount.next(0);
            this.accountAdminArray = [];
            return of([]);
          } else {
            // re-throw the error if it's not a 404
            throw error;
          }
        })
      );
    }
  }

  createPrimaryAccount(primaryAccount) {
    if (this.local) {
      const account = new Account();
      account.detail = primaryAccount;
      account.id = account.uuid = parseInt(Math.random().toString().slice(2, 11), 10);
      return this.http.post(`${this.endPoint}`, account);
    } else {
      return this.http.post(`${this.endPoint}/create`, primaryAccount);
    }
  }

  checkIfUserIsAdminOfAccount(accountUUID) {
    return this.http.get(`${this.endPoint}/service/access/${accountUUID}/role/administrator`);
  }

  //GENERAL ACCOUNT METHODS
  getAccountInformation(accountUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}`);
  }

  getAccountDetail(accountUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/detail`);
  }

  putAccountDetail(accountUUID, details) {
    return this.http.put(`${this.endPoint}/${accountUUID}/detail`, details);
  }

  putAccountLogo(accountUUID, logo) {
    return this.http.put(`${this.endPoint}/${accountUUID}/detail/logo`, { logo });
  }

  getAccountFormData(accountUUID) {
    if (this.local) {
      return this.http.get('api/account-formdata').pipe(
        tap((res) => {
          this.detailAccreditations = res;
        })
      );
    } else {
      return this.http.get(`${this.endPoint}/${accountUUID}/formdata`).pipe(
        tap((res) => {
          this.detailAccreditations = res;
        })
      );
    }
  }

  postAccountFormData(accountUUID, formData) {
    if (this.local) {
      return of(formData);
    } else {
      return this.http.post(`${this.endPoint}/${accountUUID}/formdata`, formData);
    }
  }

  deleteAccountFormData(accountUUID, formUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/formdata/${formUUID}`, { responseType: 'text' });
  }

  addAccountVenues(accountUUID, venue) {
    if (this.local) {
      let currAccount;
      return this.http.get(`${this.endPoint}/${accountUUID}`).pipe(
        switchMap((res: any) => {
          venue['uuid'] = parseInt(Math.random().toString().slice(2, 55), 10);
          currAccount = res;
          currAccount.venues.push(venue);
          return this.http.post(`${this.endPoint}/${accountUUID}`, currAccount.venues);
        })
      );
    } else {
      return this.http.post(`${this.endPoint}/${accountUUID}/venues`, venue).pipe(
        tap(res => {
          this.getConnectedVenues(accountUUID);
        })
      );
    }
  }

  // getAccountVenues(accountUUID) {
  //   return this.http
  //     .get(`${this.endPoint}/${accountUUID}/venues`)
  //     .pipe(
  //       tap((res: any) => {
  //         this.connectedVenues = res;
  //       })
  //     )
  //     .subscribe();
  // }

  getAccountVenueByUUID(accountUUID, venueUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/venues/${venueUUID}`);
  }

  updateAccountVenueByUUID(accountUUID, venueUUID, venue) {
    return this.http.put(`${this.endPoint}/${accountUUID}/venues/${venueUUID}`, venue);
  }

  deleteAccountVenueByUUID(accountUUID, venueUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/venues/${venueUUID}`, { responseType: 'text' });
  }

  getAccountVenueRole(accountUUID, venueUUID, roleUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/roles/${roleUUID}`);
  }

  addAccountVenueDocuments(accountUUID, venueUUID, document) {
    return this.http.post(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/documents`, document);
  }

  getAccountVenueDocuments(accountUUID, venueUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/venue/${venueUUID}/documents`);
  }

  getAccountVenueDocumentByUUID(accountUUID, venueUUID, documentUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/venue/${venueUUID}/documents/${documentUUID}`);
  }

  updateAccountVenueDocumentByUUID(accountUUID, venueUUID, document) {
    return this.http.put(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/documents/${document.uuid}`, document);
  }

  deleteAccountVenueDocumentByUUID(accountUUID, venueUUID, documentUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/documents/${documentUUID}`, { responseType: 'text' });
  }

  addAccountVenueRole(accountUUID, venueUUID, role) {
    return this.http.post(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/roles`, role);
  }

  addAccountVenueRate(accountUUID, venueUUID, rate) {
    return this.http.post(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/rates`, rate);
  }

  updateAccountVenueRole(accountUUID, venue, roleUUID, role) {
    if (this.local) {
      return of(role);
      // this.getConnectedVenues(accountUUID);
      // let inx = venue.roles.findIndex(r => r.uuid === roleUUID);
      // venue.roles.splice(inx, 1, role);
      // let editedObj = {
      //   uuid: venue?.uuid,
      //   venue: venue,
      //   client: {
      //     name: 'Robert\'s Super Security Firm Pty Ltd',
      //     uuid: '12341234134'
      //   }
      // }
      // return this.http.post(`api/connectedVenues`, [editedObj]);
    } else {
      return this.http.put(`${this.endPoint}/${accountUUID}/venues/${venue?.uuid}/roles/${roleUUID}`, role);
    }
  }

  updateAccountVenueRate(accountUUID, venueUUID, rateUUID, rate) {
    return this.http.put(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/rates/${rateUUID}`, rate);
  }

  deleteAccountVenueRole(accountUUID, venueUUID, roleUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/roles/${roleUUID}`);
  }

  deleteAccountVenueRate(accountUUID, venueUUID, rateUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/rates/${rateUUID}`);
  }

  addVenueAccreditation(accountUUID, venueUUID, accreditation) {
    return this.http.post(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/accreditation`, accreditation);
  }

  deleteVenueAccreditation(accountUUID, venueUUID, templateUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/accreditation/${templateUUID}`);
  }

  updateVenueAccreditation(accountUUID, venueUUID, accreditation) {
    return this.http.put(`${this.endPoint}/${accountUUID}/venues/${venueUUID}/accreditation`, accreditation);
  }

  getConnectedVenues(accountUUID) {
    if (this.local) {
      return this.http.get('api/connectedVenues').pipe(
        tap(res => {
          this.connectedVenues = res;
        })
      ).subscribe();
    } else {
      this.http
        .get(`${this.endPoint}/${accountUUID}/connected-venues`)
        .pipe(tap((res) => (this.connectedVenues = res)))
        .subscribe();
    }
  }

  getShiftRoles() {
    if (this.local) {
      return this.http
        .get('api/shift-roles')
        .pipe(
          tap((res) => {
            this.shiftRoles = res;
          })
        )
        .subscribe();
    }
  }

  // MEMBERS METHODS

  updateAccountMember(accountUUID, currentMember, newMember) {
    if (this.local) {
      const member = currentMember;
      member.department = newMember.department;
      member.role = newMember.role;
      return of(member);
    } else {
      return this.http.put(`${this.endPoint}/${accountUUID}/members/${currentMember.user_id}`, newMember);
    }
  }

  deactivateAccountMember(accountUUID, memberUUID) {
    return this.http.put(`${this.endPoint}/${accountUUID}/members/deactivate/${memberUUID}`, null);
  }

  activateAccountMember(accountUUID, memberUUID) {
    return this.http.put(`${this.endPoint}/${accountUUID}/members/activate/${memberUUID}`, null);
  }

  activateAccountResources(accountUUID, memberUUID) {
    return this.http.put(`${this.endPoint}/${accountUUID}/resources/${memberUUID}/activate`, null);
  }


  // ACCOUNT INVITES METHODS
  getInvitesForAccount(accountUUID) {
    return this.http.get(`${this.endPoint}/invite/${accountUUID}`);
  }

  declineInviteForAccount(coonectionId) {
    return this.http.put(`${this.endPoint}/connections/account/decline/${coonectionId}`, null)
  }

  acceptInviteForAccount(coonectionId) {
    return this.http.put(`${this.endPoint}/connections/account/accept/${coonectionId}`, null)
  }

  resendInviteUserToAccount(accountUUID, email, data) {
    return this.deleteInviteUserToAccount(accountUUID, email).pipe(switchMap(() => this.inviteUserToAccount(accountUUID, email, data)));
  }

  getInviteUserToAccount(accountUUID, email) {
    return this.http.get(`${this.endPoint}/invite/email/${accountUUID}/${email}`);
  }

  deleteInviteUserToAccount(accountUUID, email) {
    return this.http.delete(`${this.endPoint}/invite/email/${accountUUID}/${email}`);
  }

  inviteUserToAccount(accountUUID, email, data) {
    return this.http.post(`${this.endPoint}/invite/email/${accountUUID}/${email}`, data);
  }

  batchInviteUsersToAccount(accountUUID, dataArray) {
    return this.http.post(`${this.endPoint}/invite/email/batch/${accountUUID}`, dataArray);
  }

  getAllAccountResources(accountUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources`);
  }

  // INVITE EXTERNAL MANAGER TO SUPPLIER OR CLIENT
  updateInvitationClient(accountUUID, clientUUID, invite) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/invite`, invite);
  }

  updateInvitationSupplier(accountUUID, supplierUUID, formData) {
    return this.http.put(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/invite`, formData);
  }

  // ACCOUNT RESOURCES METHODS

  getResourcesCredentialsRole(account, roleUUID) {
    if (this.local) {
      const resourcesSuppliers = [];
      account?.resources.forEach((res, i) => {
        let resource = {...res};
        resource['assessment'] = {
          "1Star": 0,
          "2Star": 0,
          "3Star": 0,
          "4Star": 0,
          "5Star": 0,
          "_id": 'string',
          'avg': 0,
          "total": 0,
        };
        resource['formdata'] = [
          {type: 'Accreditation', tags: ['Other induction'], creation_date_time: moment() }
        ];
        let relatedResource = {
          resource: resource,
          supplier: account.suppliers[i]
        }
        resourcesSuppliers.push(relatedResource);
      });
      return of(resourcesSuppliers);
    } else {
      return this.http.get(`${this.endPoint}/${account?.uuid}/resources/role/${roleUUID}`);
    }
  }

  getAccountResourceByUUID(accountUUID, resourceUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}`);
  }

  updateResourceDetail(accountUUID, resourceUUID, details) {
    return this.http.put(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/detail`, details);
  }

  addResourceDocuments(accountUUID, resourceUUID, documents) {
    return this.http.post(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/documents`, documents);
  }

  getResourceDocuments(accountUUID, resourceUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/documents`);
  }

  getResourceDocumentByUUID(accountUUID, resourceUUID, documentUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/documents/${documentUUID}`);
  }

  updateResourceDocumentByUUID(accountUUID, resourceUUID, documentUUID, document) {
    return this.http.put(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/documents/${documentUUID}`, document);
  }

  deleteResourceDocumentByUUID(accountUUID, resourceUUID, documentUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/documents/${documentUUID}`, { responseType: 'text' });
  }

  addResourceFormData(accountUUID, resourceUUID, formData) {
    if (this.local) {
      this.accreditations.push(formData);
      let currAccount = this.currentAccount.getValue();
      let resource = currAccount.resources.find(r => r.user_id === resourceUUID);
      resource['formdata'] = this.accreditations;
      let idx = currAccount.resources.findIndex(r => r.uuid === resourceUUID);
      currAccount.resources.splice(idx, 1, resource);
      this.currentAccount = currAccount;
      return of ('Ok');
    } else {
      return this.http.post(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/formdata`, formData);
    }
  }

  getResourceFormData(accountUUID, resourceUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/formdata`);
  }

  getResourceFormDataByUUID(accountUUID, resourceUUID, formDataUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/formdata/${formDataUUID}`);
  }

  updateResourceFormDataByUUID(accountUUID, resourceUUID, formDataUUID, formData) {
    return this.http.put(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/formdata/${formDataUUID}`, formData);
  }

  deleteResourceFormDataByUUID(accountUUID, resourceUUID, formDataUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/formdata/${formDataUUID}`, { responseType: 'text' });
  }

  getResourceRates(accountUUID, resourceUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/rate`);
  }

  updateResourceRate(accountUUID, resourceUUID, rate) {
    return this.http.post(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/rate`, rate);
  }

  deactivateResource(accountUUID, resourceUUID) {
    return this.http.put(`${this.endPoint}/${accountUUID}/resources/${resourceUUID}/deactivate`, null);
  }

  getConnectedResources(accountUUID) {
    if (this.local) {
      return of([]);
    } else {
      this.http
        .get(`${this.endPoint}/${accountUUID}/connected-resources`)
        .pipe(tap((res) => (this.connectedResources = res)))
        .subscribe();
    }
  }

  //ACCOUNT CLIENTS METHODS

  getClientsToAccount(accountUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients`);
  }

  addClientToAccount(accountUUID, clientData) {
    if (this.local) {
      clientData.detail = clientData.account_detail;
      clientData.connection_status = 0;
      return this.http.get(`${this.endPoint}/${accountUUID}`).pipe(
        switchMap((res: any) => {
          const account = res;
          clientData.id = clientData.uuid = parseInt(Math.random().toString().slice(2, 11), 10);
          account?.clients.push(clientData);
          return this.http.put(`${this.endPoint}/${accountUUID}`, account);
        }),
        switchMap(() => {
          return of(clientData)
        })
      );
    } else {
      return this.http.post(`${this.endPoint}/${accountUUID}/clients`, clientData).pipe(tap((res) => (this.isEditingAccount = false)));
    }
  }

  getAccountClientByUUID(accountUUID, clientUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}`);
  }

  updateClientDetail(accountUUID, clientUUID, details, form) {
    if (this.local) {
      let res = {
        detail: details
      }
      res['invitation'] = {
        email: form.get('emailAdministrator').value,
        uuid: '987654321'
      }
      return of (res);
    } else {
      return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}`, details);
    }
  }

  addClientDocuments(accountUUID, clientUUID, documents) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/documents`, documents);
  }

  getClientDocuments(accountUUID, clientUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/documents`);
  }

  getClientDocumentByUUID(accountUUID, clientUUID, documentUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/documents/${documentUUID}`);
  }

  updateClientDocumentByUUID(accountUUID, clientUUID, documentUUID, document) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/documents/${documentUUID}`, document);
  }

  deleteClientDocumentByUUID(accountUUID, clientUUID, documentUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/documents/${documentUUID}`, { responseType: 'text' });
  }

  addClientFormData(accountUUID, clientUUID, formData) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/formdata`, formData);
  }

  getClientFormData(accountUUID, clientUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/formdata`);
  }

  getClientFormDataByUUID(accountUUID, clientUUID, formDataUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/formdata/${formDataUUID}`);
  }

  updateClientFormDataByUUID(accountUUID, clientUUID, formDataUUID, formData) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/formdata/${formDataUUID}`, formData);
  }

  deleteClientFormDataByUUID(accountUUID, clientUUID, formDataUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/formdata/${formDataUUID}`, { responseType: 'text' });
  }

  addClientVenues(accountUUID, clientUUID, venues) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues`, venues);
  }

  getClientVenues(accountUUID, clientUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues`);
  }

  getVenueManagers(accountUUID, venueUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/venue-managers/${venueUUID}`);
  }

  addVenueManager(accountUUID, venueUUID, member) {
    if (this.local) {
      this.getConnectedVenues(accountUUID);
      let conVenues = this.connectedVenues.getValue();
      let currVenue = conVenues.find(v => v.venue.uuid === venueUUID);
      currVenue.venue.managers.push(member);
      return of(currVenue?.venue?.managers);
    } else {
      const formData = new HttpParams().set('member_uuid', member.user_id);
      const headers = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
      return this.http.post(`${this.endPoint}/${accountUUID}/venue-managers/${venueUUID}`, formData.toString(), headers);
    }
  }

  removeVenueManager(accountUUID, venueUUID, managerUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/venue-managers/${venueUUID}/${managerUUID}`);
  }

  getClientVenueByUUID(accountUUID, clientUUID, venueUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}`);
  }

  updateClientVenueByUUID(accountUUID, clientUUID, venueUUID, venue) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}`, venue);
  }

  deleteClientVenueByUUID(accountUUID, clientUUID, venueUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}`, { responseType: 'text' });
  }

  getClientVenueRole(accountUUID, clientUUID, venueUUID, roleUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/roles/${roleUUID}`);
  }

  addClientVenueRole(accountUUID, clientUUID, venueUUID, role) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/roles`, role);
  }

  addClientVenueRate(accountUUID, clientUUID, venueUUID, rate) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/rates`, rate);
  }

  addClientVenueDocument(accountUUID, clientUUID, venueUUID, document) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/documents`, document);
  }

  getClientVenueDocuments(accountUUID, clientUUID, venueUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/documents`);
  }

  getClientVenueDocumentByUUID(accountUUID, clientUUID, venueUUID, documentUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/documents/${documentUUID}`);
  }

  updateClientVenueDocumentByUUID(accountUUID, clientUUID, venueUUID, documentUUID, document) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/documents/${documentUUID}`, document);
  }

  deleteClientVenueDocumentByUUID(accountUUID, clientUUID, venueUUID, documentUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/documents/${documentUUID}`, { responseType: 'text' });
  }

  updateClientVenueRole(accountUUID, clientUUID, venueUUID, roleUUID, role) {
    if (this.local) {
      return this.http.get('api/connectedVenues').pipe(
        switchMap((res: any) => {
          let venues = res;
          let venue = venues.find(v => v.venue.uuid === venueUUID);
          let roleIndex = venue?.venue.roles.findIndex(r => r.uuid === roleUUID);
          venue.venue.roles.splice(roleIndex, 1, role);
          venues[0] = venue;
          this.connectedVenues = venues;
          return this.http.put(`api/connectedVenues`, venues);
        }),
        tap(e => {
          this.getConnectedVenues(accountUUID);
        })
      // return this.http.get('api/shift-roles').pipe(
      //   switchMap((res: any[]) => {
      //     res.push(role);
      //     this.shiftRoles = res;
      //     return this.http.put('api/shift-roles', res);
      //   }),
      //   switchMap((res) => {
      //     return of(role)
      //   })
      );
    } else {
      return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/roles/${roleUUID}`, role);
    }
  }

  updateClientVenueRate(accountUUID, clientUUID, venueUUID, rateUUID, rate) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/rates/${rateUUID}`, rate);
  }

  deleteClientVenueRole(accountUUID, clientUUID, venueUUID, roleUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/roles/${roleUUID}`);
  }

  deleteClientVenueRate(accountUUID, clientUUID, venueUUID, rateUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/rates/${rateUUID}`);
  }

  addClientVenueAccreditation(accountUUID, clientUUID, venueUUID, accreditation) {
    return this.http.post(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/accreditation`, accreditation);
  }

  updateVenueClientAccreditation(accountUUID, clientUUID, venueUUID, accreditation) {
    return this.http.put(`${this.endPoint}/${accountUUID}/clients/${clientUUID}/venues/${venueUUID}/accreditation`, accreditation);
  }

  //ACCOUNT SUPPLIERS METHODS
  addSupplierToAccount(accountUUID, supplierData): Observable<any> {
    if (this.local) {
      supplierData.detail = supplierData.account_detail;
      supplierData.connection_status = 0
      return this.http.get(`${this.endPoint}/${accountUUID}`).pipe(
        switchMap((res: any) => {
          supplierData.id = supplierData.uuid = parseInt(Math.random().toString().slice(2, 11), 10);
          res.suppliers.push(supplierData);
          return this.http.put(`${this.endPoint}/${accountUUID}`, res);
        }),
        switchMap(() => of(supplierData))
      );
    } else {
      return this.http.post(`${this.endPoint}/${accountUUID}/suppliers`, supplierData).pipe(tap((res) => (this.isEditingAccount = false)));
    }
  }

  getAccountSupplierByUUID(accountUUID, supplierUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}`);
  }

  updateSupplierDetail(accountUUID, supplierUUID, details, form) {
    if (this.local) {
      let res = {
        detail: details
      }
      res['invitation'] = {
        email: form.get('emailAdministrator').value,
        uuid: '987654321'
      }
      return of (res);
    } else {
      return this.http.put(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}`, details);
    }
  }

  addSupplierDocuments(accountUUID, supplierUUID, documents) {
    return this.http.post(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/documents`, documents);
  }

  getSupplierDocuments(accountUUID, supplierUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/documents`);
  }

  getSupplierDocumentByUUID(accountUUID, supplierUUID, documentUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/documents/${documentUUID}`);
  }

  updateSupplierDocumentByUUID(accountUUID, supplierUUID, documentUUID, document) {
    return this.http.put(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/documents/${documentUUID}`, document);
  }

  deleteSupplierDocumentByUUID(accountUUID, supplierUUID, documentUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/documents/${documentUUID}`, { responseType: 'text' });
  }

  addSupplierFormData(accountUUID, supplierUUID, formData) {
    return this.http.post(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/formdata`, formData);
  }

  getSupplierFormData(accountUUID, supplierUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/formdata`);
  }

  getSupplierFormDataByUUID(accountUUID, supplierUUID, formDataUUID) {
    return this.http.get(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/formdata/${formDataUUID}`);
  }

  updateSupplierFormDataByUUID(accountUUID, supplierUUID, formDataUUID, formData) {
    return this.http.put(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/formdata/${formDataUUID}`, formData);
  }

  deleteSupplierFormDataByUUID(accountUUID, supplierUUID, formDataUUID) {
    return this.http.delete(`${this.endPoint}/${accountUUID}/suppliers/${supplierUUID}/formdata/${formDataUUID}`, { responseType: 'text' });
  }

  //Users Forms methods

  getUserFormData() {
    return this.http
      .get(`${this.endPoint}/user/formdata`)
      .pipe(tap((res: any[]) => {}))
      .subscribe();
  }

  postUserFormData(formData) {
    return this.http.post(`${this.endPoint}/user/formdata`, formData);
  }

  deleteUserFormData(uuid) {
    return this.http.delete(`${this.endPoint}/user/formdata/${uuid}`, { responseType: 'text' });
  }
}
