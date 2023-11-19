import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";

import { catchError, EMPTY, Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { AuditLogService } from "app/core/services/audit-log/audit-log.service";
import { AccountService } from "app/core/services/account/account.service";

@Component({
  selector: "app-audit-log-details",
  templateUrl: "./audit-log-details.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuditLogDetailsComponent implements OnInit {
  auditLogForm: FormGroup;
  currentId: string;
  currentLog: any;

  private unsubscribeAll = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditLogService: AuditLogService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.createFormAuditLog();
    this.currentId = this.route.snapshot.params["id"];
    this.auditLogService.getAuditLog(this.currentId);
    this.auditLogService.currentLog.pipe(
      tap(res => {
        this.currentLog = res;
        this.initEditForm(this.currentLog);
      }),
      catchError((err) => {
        console.log(err);
        return EMPTY;
      }),
      takeUntil(this.unsubscribeAll)
    )
    .subscribe();
  }

  cancelAuditLog() {
    this.router.navigate(["pages/audit-log"]);
  }

  createFormAuditLog() {
    this.auditLogForm = new FormGroup({
      startDay: new FormControl(""),
      endDay: new FormControl(""),
      classes: new FormControl(""),
    });
  }

  initEditForm(log) {
    const classes = JSON.stringify(log.classes);
    this.auditLogForm.patchValue({
      startDay: new Date(log.startDate),
      endDay: new Date(log.endDate),
      classes,
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
