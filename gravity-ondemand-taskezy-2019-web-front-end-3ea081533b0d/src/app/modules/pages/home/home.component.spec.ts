import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { FakeDbService } from '../../../fake-db/fake-db.service';
import { HomeComponent } from './home.component';
import { APP_BASE_HREF } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        SharedModule,
        BrowserAnimationsModule,
        InMemoryWebApiModule.forRoot(FakeDbService, {
          delay: 0,
          passThruUnknownUrl: true
        })
      ],
      declarations: [HomeComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: '/pages/home' }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check functionality', () => {
    component.shifts = [];
    component.generateChartData();
    expect(component.statistics[0]['total']).toEqual(0);
    expect(component.statistics[1]['total']).toEqual(0);
    expect(component.statistics[2]['total']).toEqual(0);
  });
});
