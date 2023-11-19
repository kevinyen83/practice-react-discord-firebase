import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";

import { AccreditationsContentComponent } from './accreditations-content.component';
import { ListAccreditationsComponent } from "../list-accreditations/list-accreditations.component";
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from "../../../../@fuse/services/confirmation";

describe('AccreditationsContentComponent', () => {
  let component: AccreditationsContentComponent;
  let fixture: ComponentFixture<AccreditationsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        ReactiveFormsModule,
        MatExpansionModule
      ],
      providers: [
        FuseConfirmationService,
        {
          provide: MatDialog,
          useValue: {}
        }
      ],
      declarations: [ AccreditationsContentComponent, ListAccreditationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditationsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
