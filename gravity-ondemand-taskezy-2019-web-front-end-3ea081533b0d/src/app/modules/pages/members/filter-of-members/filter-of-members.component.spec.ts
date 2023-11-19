import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared/shared.module';

import { FilterOfMembersComponent } from './filter-of-members.component';

describe('FilterOfMembersComponent', () => {
  let component: FilterOfMembersComponent;
  let fixture: ComponentFixture<FilterOfMembersComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,    BrowserAnimationsModule
      ],
      declarations: [ FilterOfMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOfMembersComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
