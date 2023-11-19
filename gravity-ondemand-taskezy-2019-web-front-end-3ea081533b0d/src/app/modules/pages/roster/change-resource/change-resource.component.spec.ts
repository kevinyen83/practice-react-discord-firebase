import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { ChangeResourceComponent } from './change-resource.component';
import { SharedModule } from "../../../../shared/shared.module";

describe('ChangeResourceComponent', () => {
  let component: ChangeResourceComponent;
  let fixture: ComponentFixture<ChangeResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [ ChangeResourceComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
