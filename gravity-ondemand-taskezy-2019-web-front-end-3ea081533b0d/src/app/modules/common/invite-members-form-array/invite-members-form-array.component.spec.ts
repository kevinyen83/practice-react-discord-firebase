import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { InviteMembersFormArrayComponent } from './invite-members-form-array.component';
import { FuseConfirmationService } from "../../../../@fuse/services/confirmation";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";

describe('InviteMembersFormArrayComponent', () => {
  let component: InviteMembersFormArrayComponent;
  let fixture: ComponentFixture<InviteMembersFormArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
      ],
      declarations: [ InviteMembersFormArrayComponent ],
      providers: [
        FormBuilder,
        { provide: FuseConfirmationService, useValue: '' },
        { provide: MatDialog, useValue: '' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMembersFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check clearing form',  () => {
    expect(component.addMembersForm).toBeTruthy();
    let values = ['Jonson', 'jonson@gmail.com', 'department'];
    component.getControls().forEach((control, i) => {
      control.setValue(values[i]);
    });
    component.sendInvites();
    expect(fixture.debugElement.query(By.css('.adding-member'))).toBeNull();
  });
});
