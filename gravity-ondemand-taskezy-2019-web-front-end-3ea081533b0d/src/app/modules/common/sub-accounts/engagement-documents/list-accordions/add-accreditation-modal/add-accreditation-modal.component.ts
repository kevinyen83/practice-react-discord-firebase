import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ComplianceService } from '../../../../../../core/services/compliance/compliance.service';
import { AccountService } from 'app/core/services/account/account.service';

@Component({
  selector: 'app-add-accreditation-modal',
  templateUrl: './add-accreditation-modal.component.html',
  animations: fuseAnimations
})
export class AddAccreditationModalComponent implements OnInit, AfterViewInit {
  viewNextBlock = false;
  currentStatus = 'add';
  listAccreditations = [];
  accreditationForm: FormGroup;
  // timingOfRequirementsList = [
  //   'Required for Shift',
  //   'Before commence the Shift',
  //   'After commence the shift'
  // ];
  // categories = ['Licence', 'Qualification', 'Induction', 'Vaccinacion', 'Personal'];
  subCategories = [];
  timings = [
    'Required for Shift',
    'Before commence the Shift',
    'After commence the shift'
  ];
  // templates = [
  //   'Induction 1',
  //   'Induction 2'
  // ];
  formWorkFlow = []
  selectedTemplate;

  private unsubscribeAll = new Subject();

  constructor(private dialogRef: MatDialogRef<AddAccreditationModalComponent>,
              private complianceService: ComplianceService, private accountService: AccountService,
              @Inject(MAT_DIALOG_DATA) private data) {}

  ngOnInit(): void {
    console.log("pause refresh --- true")
    this.accountService.setPauseRefresh(true);

    this.buildForm();
    this.currentStatus = this.data?.status;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.complianceService
        .checkAccreditation()
        .pipe(
          tap((res) => {
            console.log(res);
            this.listAccreditations = res;
            if (this.data) {
              this.currentStatus = 'edit';
              this.setValues();
            }
          })
          // takeUntil(this.unsubscribeAll)
        )
        .subscribe();
    });

    //TODO This variable is not used anywhere yet


    // this.accreditationService.accreditationWorkFlow
    //   .pipe(
    //     tap((data: any) => {
    //       if (data) {
    //         this.formWorkFlow = data;
    //       }
    //       if (!data || data.length === 0) {
    //         this.accreditationService.getAccreditationWorkFlow();
    //       } else {
    //
    //         // this.buildFormAccreditation();
    //       }
    //       return {};
    //     }),
    //     takeUntil(this.unsubscribeAll)
    //   )
    //   .subscribe((currProf) => {
    //     // this.currentUserProfile = currProf;
    //   });
  }

  buildForm() {
    this.accreditationForm = new FormGroup({
      name: new FormControl(''),
      category: new FormControl(''),
      subCategory: new FormControl(''),
      timing: new FormControl('')
    });
  }

  setValues() {
    console.log(this.data);
    if (this.data) {
      this.accreditationForm.patchValue({
        name: this.data.name,
        category: this.data.type,
        timing: this.data.timing_requirement
      });
      if (this.data.type) {
        this.changeCategory(this.data.type);
        this.accreditationForm.get('subCategory').setValue(this.data.description);
      }
    }
  }

  changeCategory(opt) {
    console.log(opt);
    let value = this.listAccreditations.find((accr) => accr.category === opt);
    console.log(value);
    if (value) {
      this.subCategories = value.credentials;
      this.selectedTemplate = value.id;
    }
  }

  nextBlock() {
    this.viewNextBlock = true;
  }

  toClose() {
    this.dialogRef.close();
  }

  saveAccreditation() {
    let accreditation = {
      description: this.accreditationForm.get('subCategory').value,
      name: this.accreditationForm.get('name').value,
      source: '',
      template_uuid: this.selectedTemplate,
      timing_requirement: this.accreditationForm.get('timing').value,
      type: this.accreditationForm.get('category').value
    };
    this.dialogRef.close(accreditation);
  }

  backToBlock1() {
    this.viewNextBlock = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();

    console.log("pause refresh --- false")
    this.accountService.setPauseRefresh(false);
  }
}
