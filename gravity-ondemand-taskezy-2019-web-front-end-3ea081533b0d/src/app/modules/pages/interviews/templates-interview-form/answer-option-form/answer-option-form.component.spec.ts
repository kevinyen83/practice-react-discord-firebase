import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AnswerOptionFormComponent} from './answer-option-form.component';
import { MatDialogRef} from '@angular/material/dialog';

describe('AnswerOptionFormComponent', () => {
  let component: AnswerOptionFormComponent;
  let fixture: ComponentFixture<AnswerOptionFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerOptionFormComponent ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule
      ],
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
    fixture = TestBed.createComponent(AnswerOptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
