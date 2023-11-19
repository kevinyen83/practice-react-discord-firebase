import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { AccountInvitesTabComponent } from './account-invites-tab.component';
import { FuseConfirmationService } from "../../../../../../@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";

describe('AccountInvitesTabComponent', () => {
  let component: AccountInvitesTabComponent;
  let fixture: ComponentFixture<AccountInvitesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountInvitesTabComponent ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: MatDialog,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInvitesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
