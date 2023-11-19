import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { EMPTY, Observable, of, Subject } from "rxjs";
import { takeUntil, tap, switchMap, catchError } from "rxjs/operators";

import { DocumentsService } from "app/core/services/documents/documents.service";
import { SuppliersService } from "app/core/services/supplier/suppliers.service";
import { ResourcesService } from "app/core/services/resource/resources.service";
import { ClientsService } from "app/core/services/client/clients.service";
import { AccountService } from "app/core/services/account/account.service";
import { FuseAlertType } from "@fuse/components/alert";

@Component({
  selector: "app-documents-form",
  templateUrl: "./documents-form.component.html",
})
export class DocumentsFormComponent implements OnInit, OnDestroy {
  @Input() user;
  @Input() statusDocuments;
  @Input() selectedAccount;
  @Input() indexDocuments;
  @Output() hideForm = new EventEmitter<any>();
  @Output() savedDocuments = new EventEmitter<any>();

  documentsForm: FormGroup;
  types = [
    "Policies & Procedures",
    "Training",
    "Compliance",
    "Legislation",
    "General",
  ];
  viewSpinner = false;
  currentFile;
  // links;
  currentImage: any = {};
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean;
  droppedFile;
  // allDocuments: any[] = [];
  // reserveLocation;
  // reserveImg;
  // currentIndex;
  // documentscurrentAccount = [];
  fileDropText: string;
  droppedFiles = [];
  // uploadingFiles = [];
  textDrop: string;
  currentAccount: any;
  currentDocument: any = {};

  unsubscribeAll = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,
    private resourcesService: ResourcesService,
    private accountService: AccountService,
    private clientsService: ClientsService,
    private documentsService: DocumentsService,
    private suppliersService: SuppliersService
  ) {}

  ngOnInit() {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);
    

    this.viewSpinner = true;
    this.createDocumentsForm();
    this.accountService.currentAccount
    .pipe(takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((currAccount) => {
        this.currentAccount = currAccount;
        if (this.selectedAccount && !this.selectedAccount.documents) {
          this.selectedAccount.documents = [];
        }
        // this.documentscurrentAccount = this.selectedAccount.documents;
        if (this.statusDocuments === "edit") {
          this.currentDocument =
            this.selectedAccount.documents[this.indexDocuments];
          this.createEditDocumentsForm();
        }

        this.viewSpinner = false;
      });
  }

  createEditDocumentsForm() {
    // if (this.user === 'account') {
    //   this.documentsForm.patchValue({
    //     ['type']: this.currentDocument.type,
    //     ['title']: this.currentDocument.title,
    //     ['description']: this.currentDocument.description
    //   });
    //   if (this.currentDocument['location']) {
    //     this.links = {
    //       name: this.currentDocument.location
    //     };
    //     this.reserveLocation = this.currentDocument.location;
    //   } else {
    //     this.reserveLocation = '';
    //   }
    //   if (this.currentDocument['image']) {
    //     this.currentImage = this.currentDocument.image;
    //     this.reserveImg = this.currentDocument.image;
    //   } else {
    //     this.reserveImg = null;
    //   }
    // this.allDocuments.forEach((doc, i) => {
    //   if (doc.type === this.currentDocument.type && doc.title === this.currentDocument.title &&
    //     doc.description === this.currentDocument.description) {
    //     this.currentIndex = i;
    //   }
    // });
    // } else {
    this.currentDocument = this.selectedAccount.documents[this.indexDocuments];
    this.documentsForm.patchValue({
      ["type"]: this.currentDocument.type,
      ["title"]: this.currentDocument.title,
      ["description"]: this.currentDocument.description,
    });
    if (this.currentDocument.location) {
      const fileName = this.currentDocument.location;
      const regex = /(.*?)\.(jpg|png|jpeg)$/;
      if (fileName.match(regex)) {
        this.documentsService
          .getFilesDownload(this.currentDocument.location)
          .pipe(
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
              this.currentImage.file = event.target["result"];
            };
          });
      } else {
        const extension = this.currentDocument.location.split(".");
        const fileExtension = extension[1] ? "." + extension[1] : "";
        this.currentImage.name = this.currentDocument.title + fileExtension;
      }
    }
    // else {

    // this.reserveLocation = '';
    // }
    // if (this.currentDocument['image']) {
    //   this.currentImage = this.currentDocument.image;
    //   this.reserveImg = this.currentDocument.image;
    // } else {
    //   this.reserveImg = null;
    // }
    // this.allDocuments.forEach((doc, i) => {
    //   if (doc.type === this.selectedAccount.documents[this.indexDocuments].type &&
    //     doc.title === this.selectedAccount.documents[this.indexDocuments].title &&
    //     doc.description === this.selectedAccount.documents[this.indexDocuments].description) {
    //       this.currentIndex = i;
    //   }
    // });
    // }
  }

  createDocumentsForm(): void {
    this.documentsForm = this.formBuilder.group({
      type: ["", Validators.required],
      title: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  onFileChange(event) {
    this.currentFile = event.target.files[0] as File;
    // this.uploadingFiles.push(this.currentFile);
    this.preview();
  }

  fileLeave(event) {
    this.fileDropText =
      "Drag & Drop documents in such formats as .png .jpg .pdf .docx .txt";
  }

  preview() {
    // fetch(this.currentFile).then((response) => {
    //   return response.blob();
    // }).then((myBlob) => {
    //   this.currentImage = URL.createObjectURL(myBlob);
    // });
    const mimeType = this.currentFile.type;
    const reader = new FileReader();
    if (
      mimeType === "image/png" ||
      mimeType === "image/jpg" ||
      mimeType === "image/jpeg"
    ) {
      reader.readAsDataURL(this.currentFile);
      reader.onload = () => {
        this.currentImage = {
          file: reader.result,
        };
      };
    } else {
      let fileName = this.currentFile.name;

      if (
        this.documentsForm.get("title").value &&
        this.documentsForm.get("title").value.length > 0
      ) {
        const extension = this.currentFile.name.split(".");
        const fileExtension = extension[1] ? "." + extension[1] : "";
        fileName = this.documentsForm.get("title").value + fileExtension;
      }
      this.currentImage = {
        name: fileName,
      };
    }
  }

  cancelDocument() {
    this.hideForm.emit();
  }

  addDocuments() {
    if (this.documentsForm.invalid) {
      for (let control in this.documentsForm.controls) {
        this.documentsForm.controls[control].markAsTouched();
      }
      return;
    }
    this.viewSpinner = true;
    const document = {
      type: this.documentsForm.get("type").value,
      title: this.documentsForm.get("title").value,
      description: this.documentsForm.get("description").value,
      location: null,
      image: null,
    };

    this.uploadFiles()
      .pipe(
        tap((res) => {
          if (res.filename) {
            document.location = res.filename;
          }
          if (this.statusDocuments === "add") {
            this.selectedAccount.documents.push(document);
          } else {
            this.selectedAccount.documents[this.indexDocuments] = document;
          }
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (this.user === "account") {
          this.updateAccount(this.selectedAccount);
        } else if (this.user === "supplier") {
          this.updateSupplier(this.selectedAccount);
        } else if (this.user === "resource") {
          this.updateResource(this.selectedAccount);
        } else if (this.user === "client") {
          this.updateClient(this.selectedAccount);
        }
      });
  }

  // createUser(): Account {
  //   return new Account();
  // }

  uploadFiles(): Observable<any> {
    if (this.currentFile) {
      const data = new FormData();
      data.append("file", this.currentFile);
      return this.documentsService.getFilesUpload(data);
    } else {
      return of({});
    }
  }

  updateAccount(account) {
    this.documentsService
      .updateDocuments(account.uuid, account.documents)
      .pipe(
        switchMap((res) => this.documentsService.getDocuments(account.uuid)),
        tap((data) => {
          this.viewSpinner = false;
          this.savedDocuments.emit();
          this.hideForm.emit();
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          // Set the alert
          this.alert = {
            type: "error",
            message: `${err.error}`,
          };

          // Show the alert
          this.showAlert = true;
          return EMPTY;
        })
      )
      .subscribe(
        (res) => {});
  }

  updateSupplier(supplier) {
    this.suppliersService
      .updateSupplier(this.currentAccount.uuid, supplier.uuid, supplier)
      .pipe(
        tap((data) => {
          this.viewSpinner = false;
          this.savedDocuments.emit();
          this.hideForm.emit();
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateResource(resource) {
    this.resourcesService
      .updateResource(this.currentAccount.uuid, resource.uuid, resource)
      .pipe(
        tap((data) => {
          this.viewSpinner = false;
          this.savedDocuments.emit();
          this.hideForm.emit();
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateClient(client) {
    this.clientsService
      .updateClient(this.currentAccount.uuid, client.uuid, client)
      .pipe(
        tap((data) => {
          this.viewSpinner = false;
          this.savedDocuments.emit();
          this.hideForm.emit();
        }),
        takeUntil(this.unsubscribeAll),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
    
    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
    
  }
}
