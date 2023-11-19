import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from '../../common-view.module';

import { EngagementDocumentsComponent } from './engagement-documents.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

describe('EngagementDocumentsComponent', () => {
  let component: EngagementDocumentsComponent;
  let fixture: ComponentFixture<EngagementDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CommonViewModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule
      ],
      declarations: [EngagementDocumentsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementDocumentsComponent);
    component = fixture.componentInstance;
    component.venue = {
      name: 'a venue',
      uuid: '1234-1234-1234-1234'
    };
    component.venueClient = {
      name: 'a client',
      uuid: '1234-1234-1234-1234'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
