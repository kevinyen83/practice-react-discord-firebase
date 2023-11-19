import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";

import { VenuesService } from "app/core/services/venues/venues.service";
import { fuseAnimations } from "@fuse/animations";
import { EMPTY } from "rxjs";
import { AccountService } from "app/core/services/account/account.service";
import { AddVenueManagerComponent } from "../add-venue-manager/add-venue-manager.component";

@Component({
  selector: "app-venue-managers",
  templateUrl: "./venue-managers.component.html",
  animations: fuseAnimations
})
export class VenueManagersComponent implements OnInit {
  members = [];
  managers = [];
  currentAccount;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ["name", "email", "activeLink"];

  @Input() venue;
  @Input() venueClient;

  unsubscribeAll = new Subject<any>();

  constructor(
    // private VenuesService: VenuesService,
    // private clientsService: ClientsService,
    private accountService: AccountService,
    private venuesService: VenuesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('vc', this.venueClient);
    this.accountService.currentAccount
      .pipe(
        tap((res: any) => {
          this.currentAccount = res;

          // this.members = [...this.venueClient.members];
          this.managers = this.venue?.managers || [];
          // should this just show  client members who are managers?
          // do we set venue managers for each venue from the clients member list?
          this.dataSource = new MatTableDataSource<any>(this.managers);
        }),
        catchError((err) => {
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  addManager() {
    this.venuesService.selectedMembersIds = [];
    let dialog = this.dialog.open(AddVenueManagerComponent, {
      width: '1100px',
      data: {
        venueClient: this.venueClient,
        managers: this.managers.map(m => m.uuid)
      }
    });
    dialog.afterClosed().subscribe(res => {
      if (res && res.length) {
        res.forEach(m => {
          this.accountService.addVenueManager(this.venue?.client?.uuid, this.venue.uuid, m).pipe(
            tap((ms: any) => {
              this.managers = [...this.members, ...ms];
              this.dataSource = new MatTableDataSource<any>(this.managers);
            }),
            takeUntil(this.unsubscribeAll)
          ).subscribe();
        });
      }
    })
  }

  removeManager(manager) {
    this.accountService.removeVenueManager(this.venue?.client?.uuid, this.venue?.uuid, manager?.uuid).pipe(
      tap((res: any) => {
        this.managers = this.managers.filter(m => m.uuid !== manager.uuid);
        this.dataSource = new MatTableDataSource<any>(this.managers);
        this.accountService.getConnectedVenues(this.currentAccount.uuid)
      }),
      takeUntil(this.unsubscribeAll)
    ).subscribe();
  }

  editManager() {}

  deleteManager(manager) {
    this.members = this.members.filter((m) => m.uuid !== manager.uuid);
    this.dataSource = new MatTableDataSource<any>(this.members);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
