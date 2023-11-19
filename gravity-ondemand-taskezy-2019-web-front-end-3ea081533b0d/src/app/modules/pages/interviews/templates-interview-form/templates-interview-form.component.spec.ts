import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {TemplatesInterviewFormComponent} from './templates-interview-form.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TemplatesInterviewFormComponent', () => {
  let component: TemplatesInterviewFormComponent;
  let fixture: ComponentFixture<TemplatesInterviewFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesInterviewFormComponent ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesInterviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
