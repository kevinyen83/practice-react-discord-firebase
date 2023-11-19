import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";


import {combineLatest, EMPTY, of, Subject} from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";

import { AccountService } from "app/core/services/account/account.service";
import { IncidentReportingService } from "app/core/services/incidents/incident-reporting.service";
import { FormTemplatesService } from "app/core/services/form-templates/form-templates.service";
import { RosterService } from "app/core/services/roster/roster.service";
import moment from "moment";
import {
  DocumentsService
} from "app/core/services/documents/documents.service";

@Component({
  selector: "app-incident-report",
  templateUrl: "./incident-report.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IncidentReportComponent implements OnInit, OnDestroy {

  currentAccount: any = {};
  incident: any = {};
  incidentTemplate: any = {};
  unsubscribeAll = new Subject<any>();
  queryParams;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private incidentService: IncidentReportingService,
    private templateService: FormTemplatesService,
    private rosterService: RosterService,
    private documentsService: DocumentsService
  ) {

  }

  ngOnInit() {

    combineLatest([this.accountService.currentAccount,
    this.route.queryParams])
      .pipe(
        switchMap((res: any) => {
          this.currentAccount = res[0] || {};
          if(this.currentAccount.uuid) {
            this.incident = this.incidentService.currentReport.getValue();

            if(!this.incident.uuid) {
              this.getIncidentFromParams();
            } else {
              this.handleLoadDocument()
            }

            return this.templateService.getAllTemplates(this.currentAccount.uuid)
          } else {
            return EMPTY;
          }
        }),
        tap((res) => {
          let global = res[0] || [];
          this.incidentTemplate = global?.find((template) => template.name == "Incident Report");
        }),
        catchError((err) => {
          return EMPTY;
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe();
  }

  handleLoadFiles(licenceItem) {
    if(licenceItem.uuid) {
      this.documentsService.getFilesDownload(licenceItem.uuid).pipe(
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onload = () => {
          licenceItem.imageSource = event.target["result"];
        };
      });
    }
  }

  getIncidentFromParams() {
    let shift: any = {};
    let task: any = {};
    let incident: any = {};

    this.rosterService.getShift(this.queryParams?.shift)
    .pipe(
      tap(async (res: any) => {
        shift = res;

        if(this.queryParams.task) {
          task = shift.tasks.find((task) => task.uuid == this.queryParams.task);
          incident = task.form_data.find((form) => form.uuid == this.queryParams.formId);

        } else {

          incident = shift.form_data.find((form) => form.uuid == this.queryParams.formId);
        }

        let parsedData = {};
        if (typeof incident.data === "object") {
          const tempData: any = [];
          (incident.data || []).forEach((item) => {
            tempData[item.Key] = item.Value;
          });
          parsedData = JSON.parse(tempData.data);
        } else if (typeof incident.data === "string") {
          parsedData = JSON.parse(incident.data);
        }

        this.incidentService.currentReport = this.incident = {
          ...incident,
          parsedData: parsedData || {},
          task: task.uuid? {
            uuid: task.uuid,
            supplier: task.supplier,
            resource: task.resource,
            supervisor: task.supervisor,
            role: task.role
          }:{},
          shift: {
            uuid: shift.uuid,
            client: [...this.currentAccount.clients, this.currentAccount].find((cl) => cl.uuid == shift.client_uuid),
            venue: shift.venue,
            datetime: shift.datetime,
            timeEnd: moment(shift.datetime).add(shift.duration, 'm').format()
          }
        }

        this.handleLoadDocument()
      })
    )
    .subscribe();
  }

  async handleLoadDocument() {
    if(this.incident.parsedData?.document) {
      const documents = []
      for(const docItem of this.incident.parsedData?.document) {
        const result: any = await this.documentsService.getMetaData(docItem.uuid).toPromise();
        const documentData = {
          type: result?.metadata?.content_type,
          url: docItem.url,
          uuid: docItem.uuid,
          metaData: result
        }
        this.handleLoadFiles(documentData)
        documents.push(
          documentData
        )
      }
      this.incident.parsedData.documents = documents;
    } else {
      this.incident.parsedData.documents = []
    }
  }

  handleDownload(data, title) {
    const element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', `${title}`);
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    element.click();
  }

  goToBack() {
    this.incidentService.cleanUp();
    this.router.navigate(["/pages/incident-reporting"]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
