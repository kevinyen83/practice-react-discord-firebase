import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftRoleWindowComponent } from './add-shift-role-window.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { MatStepperModule } from '@angular/material/stepper';
import { AccreditationsContentComponent } from '../accreditations-content/accreditations-content.component';
import { ListAccreditationsComponent } from '../list-accreditations/list-accreditations.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from "@angular/cdk/testing";
import { MatRadioModule } from "@angular/material/radio";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { By } from "@angular/platform-browser";

describe('AddShiftRoleWindowComponent', () => {
  let component: AddShiftRoleWindowComponent;
  let fixture: ComponentFixture<AddShiftRoleWindowComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddShiftRoleWindowComponent,
        AccreditationsContentComponent,
        ListAccreditationsComponent
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatIconModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        TextFieldModule
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MatDialog,
          useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftRoleWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check tab 1', () => {
    let select: HTMLSelectElement = fixture.debugElement.query(By.css('.resource-rate .select')).nativeElement;
    expect(select).toBeTruthy();
    if (select?.options?.length) {
      select.value = select?.options[0].value;
      select.dispatchEvent(new Event('change'));
    }

    let input = fixture.debugElement.query(By.css('.role')).nativeElement;

    input.value = 'nameShiftRole';
    input.dispatchEvent(new Event('input'));

    let textarea = fixture.debugElement.query(By.css('.fuse-mat-textarea')).nativeElement;
    textarea.value = 'this is description';

    let button = fixture.debugElement.query(By.css('.mat-stepper-next')).nativeElement;
    button.click();
  });

  it('check tab 2', () => {
    let p = fixture.debugElement.query(By.css('.p-text')).nativeElement;
    expect(p.textContent.trim()).toBe('Select accreditations that will be attached to the Role');
    let expansion = fixture.debugElement.queryAll(By.css('.mat-expansion-panel-header'));
    expansion.forEach((line, index) => {
      if (index === 0) {
        line.nativeElement.click();
        let expansionChildren = line.queryAll(By.css('.mat-expansion-panel-header'));
        expansionChildren.forEach((child, inx) => {
          if (inx === 0) {
            child.nativeElement.click();
            let checkboxes = child.queryAll(By.css('mat-checkbox'));
            checkboxes[0].nativeElement.click();
          }
        })
      }
      if (index === 1) {
        line.nativeElement.click();
        let expansionChildren = line.queryAll(By.css('.mat-expansion-panel-header'));
        expansionChildren.forEach((child, inx) => {
          if (inx === 0) {
            child.nativeElement.click();
            let checkboxes = child.queryAll(By.css('mat-checkbox'));
            checkboxes[0].nativeElement.click();
          }
        })
      }
    });
    component.save();
    // let button = fixture.debugElement.query(By.css('.save-button')).nativeElement;
    // button.click();
    // fixture.detectChanges();
  });

  // it('check tab 3', () => {
  //   let p = fixture.debugElement.query(By.css('.p-select-accreditations')).nativeElement;
  //   expect(p.textContent.trim()).toBe('Select the Timing of Requirement for each accreditations');
  //   let groups = fixture.debugElement.queryAll(By.css('.table-licences'));
  //   groups.forEach((group, i) => {
  //     if (i === 0) {
  //       expect(group.nativeElement.query('mat-radio-group').nativeElement).toBeTruthy();
  //       group.nativeElement.queryAll(By.css('mat-radio-button')).forEach((el, inx) => {
  //         if (inx === 1) {
  //           el.nativeElement.click();
  //           expect(group.nativeElement.queryAll(By.css('.mat-radio-checked')).length).toBe(1);
  //         }
  //       });
  //     }
  //     if (i === 1) {
  //       expect(group.nativeElement.query('mat-radio-group').nativeElement).toBeTruthy();
  //       group.nativeElement.queryAll(By.css('mat-radio-button')).forEach((el, inx) => {
  //         if (inx === 2) {
  //           el.nativeElement.click();
  //           expect(group.nativeElement.queryAll(By.css('.mat-radio-checked')).length).toBe(1);
  //         }
  //       });
  //     }
  //   })
  // });
});
