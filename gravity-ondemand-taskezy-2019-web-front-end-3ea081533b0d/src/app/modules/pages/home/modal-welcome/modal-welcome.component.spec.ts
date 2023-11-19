import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SharedModule } from 'app/shared/shared.module';

import { ModalWelcomeComponent } from './modal-welcome.component';

describe('ModalWelcomeComponent', () => {
  let component: ModalWelcomeComponent;
  let fixture: ComponentFixture<ModalWelcomeComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        SharedModule
      ],
      declarations: [ ModalWelcomeComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
