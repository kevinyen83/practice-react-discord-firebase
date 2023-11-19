import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from 'app/shared/shared.module';

import { SearchHeaderForUsersComponent } from './search-header-for-users.component';

describe('SearchHeaderForUsersComponent', () => {
  let component: SearchHeaderForUsersComponent;
  let fixture: ComponentFixture<SearchHeaderForUsersComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule
      ],
      declarations: [ SearchHeaderForUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHeaderForUsersComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
