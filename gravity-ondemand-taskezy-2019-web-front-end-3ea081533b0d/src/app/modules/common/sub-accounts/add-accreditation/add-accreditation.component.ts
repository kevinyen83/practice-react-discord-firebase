import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { EMPTY, Subject, takeUntil, tap, map } from 'rxjs';

import { AccountService } from '../../../../core/services/account/account.service';
import { AccreditationService } from 'app/core/services/accreditation/accreditation.service';
import {
  format,
  parseISO,
  isBefore
} from 'date-fns'
import { DocumentsService, FILE_ACCESS_WRITE } from 'app/core/services/documents/documents.service';

@Component({
  selector: 'app-add-accreditation',
  templateUrl: './add-accreditation.component.html'
})
export class AddAccreditationComponent implements OnInit, OnDestroy {
  addAccreditationForm: FormGroup;
  currentCategoryWorkflow: any;
  category: any;
  accreditation: any;
  currentAccreditationWorkflow: any;
  viewFieldSubInput = false;
  subInputProp;
  accreditationList = [];
  licenseSpinner = false;
  notificationLicense: string;
  classes = [];
  classTemplate = {};
  viewFieldClass = false;
  licenseInfor = {};
  lisenseVerified = false;
  docSource = {};
  activeControl = [];
  fetchData = false;

  verification = false;
  verificationController = "";
  verificationValidation;
  viewFieldSubInputDate = false;
  subInputPropDate;
  viewFieldType = false;
  types = [];
  viewFieldStatus = false;
  statuses = [];

  viewedList = [];
  selectedFiles = [];
  // _currentAccount;
  header = 'Add accreditations';
  //TODO: this shouldnt be hard coded they should be taked from the categories avalaible for a businesses
  // optionsList = [
  //   'Master Licence',
  //   'Public Liability Insurance',
  //   'Workers Compensation Insurance',
  //   'Quality Assurance Accreditation',
  //   'Other (Details to be provided)'
  // ];
  categoryList = [];

  formWorkFlow = []
  @Input() accreditations;
  @Input() accountUUID;
  @Input() method;
  @Output() closeSideNav = new EventEmitter<any>();

  private unsubscribeAll = new Subject();

  constructor(private accountService: AccountService, private accreditationService: AccreditationService,
    private formBuilder: FormBuilder, private documentsService: DocumentsService) {
    }

  ngOnInit(): void {
    this.accountService.setPauseRefresh(true);

    this.createFormAccreditation();
    this.accreditationService.getAccreditationWorkFlow();
    this.accreditationService.accreditationWorkFlow
    .pipe(
      map((data) => {
        this.formWorkFlow = data;
        if (data && data.length) {
          this.buildFormAccreditation();
        }
      }),
      takeUntil(this.unsubscribeAll)
    )
    .subscribe(() => {
    });

  }

  createNewFormControl(item): FormControl {
    return this.addAccreditationForm.registerControl(item, new FormControl()) as FormControl;
  }

  replaceWhitespaceWithUnderscore(input: string): string {
    return input.replace(/\s+/g, '-');
  }

  buildFormAccreditation() {
    this.categoryList = this.formWorkFlow.map((category) => category.category);
  }

  handleChangeCategory() {
    this.viewFieldSubInputDate = false;
    let category = this.addAccreditationForm.get("category").value;
    this.currentCategoryWorkflow = this.formWorkFlow.find(
      (item) => item.category === category
    );

    for (let control in this.addAccreditationForm.controls) {
      control !== 'category' && control !== 'accreditation' ? this.addAccreditationForm.removeControl(control) : false;
    }

    this.category = category;

    // currentAccreditationWorkflow: any;
    this.accreditationList = this.currentCategoryWorkflow?.credentials.map(
      (item) => item.accreditation
    );
  }

  formatDate(value: string) {
    return value ? format(parseISO(value), "MMM dd yyyy") : "";
  }

  handleVerify() {
    if (this.verification) {
      const subInputValue = this.addAccreditationForm.get(
        this.verificationController
      ).value;
      const theControl = this.addAccreditationForm.get(
        this.verificationController
      );
      if (subInputValue) {
        this.licenseSpinner = true;
        this.notificationLicense = "";
        if (
          this.verificationValidation.api &&
          this.verificationValidation.api !== ""
        ) {
          this.accreditationService
            .verifyComplianceDetails(
              this.verificationValidation.api,
              subInputValue
            )
            .pipe(
              takeUntil(this.unsubscribeAll),
              tap(
                (res) => {
                  this.licenseSpinner = false;
                  if (!res) {
                    this.notificationLicense = "Licence invalid";
                    theControl.setErrors({ "Licence invalid": true });
                    // if (this.addAccreditationForm.get(this.subInputPropDate)) {
                    //   this.addAccreditationForm
                    //     .get(this.subInputPropDate)
                    //     .patchValue(null);
                    // }
                    this.classes = [];
                    this.viewFieldClass = false;
                    this.classTemplate = {};
                  } else {
                    if(this.verificationValidation?.success?.key) {
                      if(res[this.verificationValidation.success.key] !== this.verificationValidation.success.value) {
                        this.notificationLicense = "Licence invalid";
                        theControl.setErrors({ "Licence invalid": true });
                        this.classes = [];
                        this.viewFieldClass = false;
                        this.classTemplate = {};
                        return;
                      }
                    }

                    this.licenseInfor = res;
                    this.licenseInfor["classes.description"] = res.classes
                      ? res.classes.map((item) => item.description).join(",")
                      : "";
                    const date = res.expiryDate;
                    this.classes = res.classes;
                    this.classTemplate = {};
                    this.viewFieldClass = true;
                    const arrayDate = date.split("/");
                    const parseDate = new Date(
                      arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0]
                    );
                    // if (this.addAccreditationForm.get(this.subInputPropDate)) {
                    //   this.addAccreditationForm
                    //     .get(this.subInputPropDate)
                    //     .patchValue(
                    //       format(parseDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                    //     );
                    // }
                    if (isBefore(parseDate, new Date())) {
                      this.notificationLicense = "Licence Expired";
                      theControl.setErrors({ "Licence Expired": true });
                      this.lisenseVerified = false;
                    } else {
                      this.notificationLicense = "";
                      theControl.setErrors(null);
                      this.lisenseVerified = true;
                    }
                    // this.viewFieldSubInputDate = true;
                  }
                },
                (error) => {
                  this.licenseSpinner = false;
                  this.lisenseVerified = false;
                  // this.viewFieldSubInputDate = true;
                  // if (this.addAccreditationForm.get(this.subInputPropDate)) {
                  //   this.addAccreditationForm
                  //     .get(this.subInputPropDate)
                  //     .patchValue(null);
                  // }
                  this.notificationLicense = "Licence invalid";
                  theControl.setErrors({ "Licence invalid": true });
                  this.classes = [];
                  this.viewFieldClass = false;
                  this.classTemplate = {};
                  return EMPTY;
                }
              )
            )
            .subscribe();
        } else {
          this.licenseSpinner = false;
          this.lisenseVerified = false;
          this.viewFieldSubInputDate = true;
          if (this.addAccreditationForm.get(this.subInputPropDate)) {
            // this.formEditLicence.get(this.subInputPropDate).patchValue(null);
          }
          this.notificationLicense = "";
          theControl.setErrors(null);
        }
      }
    } else {
    }
  }

  handleChangeAccreditation() {
    this.accreditation = this.addAccreditationForm.get("accreditation").value;
    this.currentAccreditationWorkflow =
      this.currentCategoryWorkflow?.credentials.find(
        (item) => item.accreditation === this.accreditation
      );

    if (
      this.currentAccreditationWorkflow &&
      this.currentAccreditationWorkflow.inputs &&
      this.currentAccreditationWorkflow.inputs.length > 0
    ) {
      this.currentAccreditationWorkflow.inputs.forEach((input) => {
        switch (input.type) {
          case "string":
            this.subInputProp = input.label;
            this.viewFieldSubInput = true;

            this.verification = true;
            this.verificationController = input.label;
            this.verificationValidation =
              this.currentAccreditationWorkflow.validation;
            break;
          case "date":
            this.viewFieldSubInputDate = true;
            this.subInputPropDate = input.label;
            this.addAccreditationForm.addControl(
              input.label,
              new FormControl("", Validators.required)
            );
            break;
          case input.type === "single-choice-string" && input.label === "Type":
            this.viewFieldType = true;
            this.types = input.choices;
            this.addAccreditationForm.addControl(
              "type",
              new FormControl("", Validators.required)
            );
            break;
          case input.type === "single-choice-string" && (input.label === "Status" || input.label === "License Status"):
            this.viewFieldStatus = true;
            this.statuses = input.choices;
            this.addAccreditationForm.addControl(
              "itemStatus",
              new FormControl("", Validators.required)
            );
            break;
        }
      });
    }
  }


  close() {
    this.lisenseVerified = false;
    this.addAccreditationForm.reset();
    this.addAccreditationForm.get('category').setErrors(null);
    this.closeSideNav.emit({refresh: false});
  }

  saveFiles(event) {
    this.viewedList.push(event[0]);
    let file = event[0];
    let newFile = {};
    for (let key in Object.keys(file)) {
      newFile[key] = file[key];
    }
    // const data = new FormData();
    // data.append("file", file);
    this.selectedFiles.push(JSON.stringify(newFile));
  }

  removeFile(file) {
    this.viewedList = this.viewedList.filter((f) => f.name !== file.name);
  }


  getSubmitData() {
    const activeControlList = [];
    const submitData: any = {
      type: "Accreditation",
      roles: [],
      tags: [],
      template: "",
      data: JSON.stringify(this.licenseInfor),
    };
    submitData.tags = [this.category, this.accreditation];
    activeControlList.push("category");
    activeControlList.push("accreditation");

    if (
      this.currentAccreditationWorkflow &&
      this.currentAccreditationWorkflow.inputs &&
      this.currentAccreditationWorkflow.inputs.length > 0
    ) {
      this.currentAccreditationWorkflow.inputs.forEach((input) => {
        switch(input?.label) {
          case "License Number" && this.addAccreditationForm.get("License Number"):
            submitData.number =
              this.addAccreditationForm.get("License Number").value;
            activeControlList.push("License Number");
            break;
          case "Type" && this.addAccreditationForm.get("type"):
            submitData.type = this.addAccreditationForm.get("type").value;
            activeControlList.push("type");
            break;
          case "Status" && this.addAccreditationForm.get("itemStatus"):
            submitData.status = this.addAccreditationForm.get("itemStatus").value;
            activeControlList.push("itemStatus");
            break;
          case "Expires At" && this.addAccreditationForm.get("Expires At"):
            submitData.enddate = format(
              new Date(this.addAccreditationForm.get("Expires At").value),
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            );
            activeControlList.push("Expires At");
            break;
          case "Starts At" && this.addAccreditationForm.get("Starts At"):
            submitData.startdate = format(
              new Date(this.addAccreditationForm.get("Starts At").value),
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            );
            activeControlList.push("Starts At");
            break;
        }
      });
    }
    activeControlList.push("description");
    activeControlList.push("privated");
    activeControlList.push("primary");
    activeControlList.push("validDocument");

    this.activeControl = activeControlList;

    if (this.classTemplate) {
      const classes = [];
      for (const [key, value] of Object.entries(this.classTemplate)) {
        if (value) {
          classes.push({
            code: "",
            name: key,
          });
        }
      }

      // submitData["classes"] = classes; // Need to re-check
    }
    return submitData;
  }

  checkLicenseValid() {
    if (
      !this.currentAccreditationWorkflow.validation ||
      !this.currentAccreditationWorkflow.validation.api
    ) {
      return true;
    }
    const controlIndex = this.activeControl.findIndex(
      (control) => control === "License Number"
    );
    return controlIndex < 0 ? true : !this.licenseSpinner && this.lisenseVerified;
  }

  async handleSaveAccreditation() {
    if (!this.addAccreditationForm.valid) {
      // Need to Notify
      return;
    }

    const accreditation = this.getSubmitData();
    const licenseValid = this.checkLicenseValid();

    if (!licenseValid) {
      // Need to Notify
      return;
    }

    this.fetchData = false;

    // if (this.status === "edit") {
    //   this.accreditationService
    //     .updateUserAccreditation(accreditation)
    //     .pipe(takeUntil(this.unsubscribeAll))
    //     .subscribe((res) => {
    //       this.navController.back();
    //     });
    // } else {

      const docList: any = Object.values(this.docSource);
      const resultDoc = {}
      for(let index = 0; index < docList.length; index ++) {
        const result = await this.handleUploadFile(docList[index].file);
        resultDoc[docList[index].label] = result.filename
      }

      const licenceRes = {...this.licenseInfor, ...resultDoc}

      if(this.verificationValidation?.outputs) {
        const licenseData = [];
        for(let index = 0; index < this.verificationValidation?.outputs.length; index++) {
          const outputItem = this.verificationValidation?.outputs[index];
          if(outputItem.type === 'label') {
            licenseData.push(this.getLicenseData(outputItem, licenceRes, 'map'));
          } else if(this.verificationValidation?.outputs[index].type === 'image') {
            licenseData.push(this.getLicenseData(outputItem, licenceRes, 'label'));
          }
        }
        accreditation.data = JSON.stringify(licenseData);
      }

      const currentAccount = this.accountService.currentAccount.getValue();

      switch(this.method) {
        case 'account':
          this.accreditationService
            .addAccountAccreditation(accreditation, this.accountUUID)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((res) => {
              this.addAccreditationForm.reset()
              this.closeSideNav.emit({refresh: true});
            });
          break;
        case 'resource':
          this.accountService.addResourceFormData(currentAccount.uuid, this.accountUUID, accreditation)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((res) => {
              this.addAccreditationForm.reset()
              this.closeSideNav.emit({refresh: true});
            });
          break;
        case 'client':
          this.accountService.addClientFormData(currentAccount.uuid, this.accountUUID, accreditation)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((res) => {
              this.addAccreditationForm.reset()
              this.closeSideNav.emit({refresh: true});
            });
          break;
        case 'supplier':
          this.accountService.addSupplierFormData(currentAccount.uuid, this.accountUUID, accreditation)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((res) => {
              this.addAccreditationForm.reset()
              this.closeSideNav.emit({refresh: true});
            });
          break;
      }
  }

  getLicenseData(outputItem, licenceRes, property) {
    return {
      label: outputItem.label,
      type: outputItem.type,
      value: licenceRes[outputItem[property]]
    }
  }

  async handleUploadFile(files) {
    const currentAccount = this.accountService.currentAccount.getValue();
    const data = new FormData();
    data.append('file', files[0]);
    try {
      const result: any  = await this.documentsService
      .getFilesUpload(data).toPromise();
       await this.documentsService.handleAccessDocument(result.filename, {
          accounts: [
            {
              access: FILE_ACCESS_WRITE,
              uuid: currentAccount.uuid
            }
          ]
        }).toPromise()


        return result;
    } catch(error) {
      console.log("uploading error ---", error)
    }

  }

  // saveAccreditation() {
  //   const curentAccount = this.accountService.currentAccount.getValue();
  //   let accred = {
  //     data: {
  //       number: this.addAccreditationForm.get('numberAccreditation').value,
  //       expiry_date: this.addAccreditationForm.get('expiryDate').value,
  //       issued_by: this.addAccreditationForm.get('issuedBy').value
  //     },
  //     roles: [],
  //     tags: this.selectedFiles || [],
  //     template: '',
  //     type: this.addAccreditationForm.get('category').value
  //   };
  //   this.accountService
  //     .postAccountFormData(curentAccount.uuid, accred)
  //     .pipe(
  //       tap((res) => {
  //         this.accreditations = [
  //           ...this.accreditations,
  //           res
  //         ];
  //         this.accountService.detailAccreditations = this.accreditations;
  //         this.close();
  //       })
  //       // takeUntil(this.unsubscribeAll)
  //     )
  //     .subscribe();
  // }

  createFormAccreditation() {
    this.addAccreditationForm = this.formBuilder.group({
      category: ["", Validators.required],
      accreditation: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    this.accountService.setPauseRefresh(false);
  }

  handleSaveFiles(event, type, index) {
    const { files, res } = event;
    this.docSource[index] = {
      id: files[0].name,
      file: files,
      label: type
    }


    // const currentAccount = this.accountService.currentAccount.getValue();
    // this.documentsService.handleAccessDocument(res.filename, {
    //   accounts: [
    //     {
    //       access: FILE_ACCESS_WRITE,
    //       uuid: currentAccount.uuid
    //     }
    //   ]
    // }).subscribe(response => {
    //   console.log("document access ----", response)
    // })
    // console.log("save files ---", files, res)
  }
}
