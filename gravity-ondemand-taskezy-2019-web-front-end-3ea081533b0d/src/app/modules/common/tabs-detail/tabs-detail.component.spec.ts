import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { TabsDetailComponent } from './tabs-detail.component';

describe('TabsVenuesComponent', () => {
  let component: TabsDetailComponent;
  let fixture: ComponentFixture<TabsDetailComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[SharedModule, BrowserAnimationsModule],
      declarations: [ TabsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
