import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChildren,
  ElementRef,
  HostListener, Input
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

import * as moment from 'moment';

@Component({
  selector: 'app-adding-documents',
  templateUrl: './adding-documents.component.html'
})
export class AddingDocumentsComponent implements OnInit {

  formDocuments: FormGroup;
  error: string;
  currentClickedIndex: number;
  files = [];
  uploadedFile = null;
  viewAddDocuments:boolean = false;
  changeNameInput: boolean = false;

  @ViewChildren("fileName1") fileNameElement: ElementRef;
  @HostListener('click') onClick() {
    if (this.fileNameElement && this.currentClickedIndex !== undefined) {
      let file = this.files[this.currentClickedIndex];
      let blob = file.slice(0, file.size, file.type);
      let extension = file.type.split('/')[1];
      let newFile = new File([blob], `${this.fileGroup.controls[this.currentClickedIndex].get('fileName').value}.${extension}`, {type: file.type});
      this.files[this.currentClickedIndex] = newFile;
      this.currentClickedIndex = undefined;
    }
    this.changeNameInput = false;
  }
  @Input() existFiles;
  @Input() status;
  @Input() accountType;

  @Output() savedDocument = new EventEmitter<any>();
  @Output() cancelDocument = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.viewAddDocuments = true;
    if (this.existFiles) {
      this.saveFiles({files: [this.existFiles], res: {}})
      this.addFileGroup();
      this.viewAddDocuments = false;
      this.fileGroup?.controls[0].get('typeDocument').patchValue(this.existFiles.private ? '0' : '1');
      this.fileGroup?.controls[0].get('descriptionFile').patchValue(this.existFiles.description);
    }
  }

  saveFiles(event) {
    const { files, res } = event;

    this.uploadedFile = res;
    if (this.status === 'editOne') {
      this.files = files;
    } else {
      this.files.push(files[0]);
      this.goToAddFiles();
      this.addFileGroup();
    }
  }

  changeName(index) {
    this.currentClickedIndex = index;
    this.changeNameInput = true;
  }

  buildForm() {
    this.formDocuments = new FormGroup({
      fileGroup: new FormArray([])
    })
  }

  get fileGroup() {
    return this.formDocuments.controls['fileGroup'] as FormArray;
  }

  addFileGroup() {
    let fileGroup = this.fb.group({
      typeDocument: new FormControl(''),
      descriptionFile: new FormControl(''),
      fileName: new FormControl('')
    })
    this.fileGroup.push(fileGroup);
  }

  removeFile(file, i) {
    this.files = this.files.filter(f => f.name !== file.name);
    this.fileGroup.removeAt(i);
  }

  goToAddFiles() {
    this.viewAddDocuments = false;
  }

  cancelDocuments() {
    this.files = [];
    this.viewAddDocuments = true;

    if(this.cancelDocument) {
      this.cancelDocument.emit()
    }
  }

  save() {
    let documents = [];
    for (let control in this.fileGroup.controls) {

      let document = {
        description: this.fileGroup.controls[control].get('descriptionFile').value,
        private: this.fileGroup.controls[control].get('typeDocument').value === "0"? true: false,
        tag: ''
      }
      if(this.uploadedFile.filename) {
        document['name'] = this.uploadedFile.filename;
      }
      if (this.status === 'editOne') {
        document['uuid'] = this.existFiles.uuid;
      }
      documents.push(document);
    }
    this.savedDocument.emit(documents);
  }
}
