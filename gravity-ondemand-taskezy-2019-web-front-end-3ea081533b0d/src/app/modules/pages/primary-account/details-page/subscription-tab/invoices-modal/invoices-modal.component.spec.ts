import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MatDialogRef } from "@angular/material/dialog";

import { InvoicesModalComponent } from './invoices-modal.component';
import { SharedModule } from 'app/shared/shared.module';

describe('InvoicesModalComponent', () => {
  let component: InvoicesModalComponent;
  let fixture: ComponentFixture<InvoicesModalComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesModalComponent ],
      imports: [
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {}},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
