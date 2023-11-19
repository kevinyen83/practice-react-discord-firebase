import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { DetailsFormComponent } from './details-form.component';
import { AccountService } from "../../../../core/services/account/account.service";
import { By } from "@angular/platform-browser";

describe('DetailsFormComponent', () => {
  let component: DetailsFormComponent;
  let fixture: ComponentFixture<DetailsFormComponent>;
  let accountService: AccountService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [DetailsFormComponent],
      providers: [AccountService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFormComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check error when create sub-account', () => {
    if (component.accountType === 'client') {
      accountService.addClientToAccount(component.currentAccount.uuid, component.selectedAccount.detail).subscribe(
        (res) => {},
        () => {
          let errorEl = fixture.debugElement.query(By.css('fuse-alert')).nativeElement;
          expect(errorEl).toBeTruthy();
          expect(errorEl.textContent).toBe('Failed to create Client');
        }
      )
    }
    if (component.accountType === 'supplier') {
      accountService.addSupplierToAccount(component.currentAccount.uuid, component.selectedAccount.detail).subscribe(
        () => {},
        () => {
          let errorEl = fixture.debugElement.query(By.css('fuse-alert')).nativeElement;
          expect(errorEl).toBeTruthy();
          expect(errorEl.textContent).toBe('Failed to create Supplier');
        }
      )
    }
  });
});
