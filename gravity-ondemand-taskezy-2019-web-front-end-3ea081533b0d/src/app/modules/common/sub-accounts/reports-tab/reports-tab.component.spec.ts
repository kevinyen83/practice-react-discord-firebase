import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from '../../common-view.module';

import { ReportsTabComponent } from './reports-tab.component';

describe('ReportsTabComponent', () => {
  let component: ReportsTabComponent;
  let fixture: ComponentFixture<ReportsTabComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,    BrowserAnimationsModule,
        HttpClientTestingModule,
        CommonViewModule
      ],
      declarations: [ ReportsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
