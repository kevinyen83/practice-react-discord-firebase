import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { By } from "@angular/platform-browser";

import { AddVenueManagerComponent } from './add-venue-manager.component';

describe('AddVenueManagerComponent', () => {
  let component: AddVenueManagerComponent;
  let fixture: ComponentFixture<AddVenueManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatTableModule
      ],
      declarations: [AddVenueManagerComponent],
      providers: [
        FuseConfirmationService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVenueManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check add venue manager', () => {
    let p = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(p.textContent.trim()).toBe('Choose Venue Managers');
    let table = fixture.debugElement.query(By.css('.table-managers')).nativeElement;
    expect(table).toBeTruthy();
    let members = fixture.debugElement.queryAll(By.css('.mat-row'));
    component.dataSource?.filteredData.forEach((m, i)=> {
      if (component.managers.includes(m.user_id)) {
        expect(members[i].nativeElement.classes['mat-checkbox-disabled']).toBeTruthy();
        expect(members[i].nativeElement.classes['mat-checkbox-checked']).toBeTruthy();
      }
    });
    if (members?.length)  {
      members.forEach((member, i) => {
        if (i === 0) {
          member.nativeElement.query(By.css('mat-checkbox')).nativeElement.click();
        }
      });
      let checkedMembers = fixture.debugElement.queryAll(By.css('.mat-checkbox-checked'));
      expect(checkedMembers.length).toBe(1);
      let button = fixture.debugElement.query(By.css('.save-button')).nativeElement;
      expect(button.disabled).toBeFalsy();
      button.click();
      expect(p).toBeUndefined();
    }
  });
});
