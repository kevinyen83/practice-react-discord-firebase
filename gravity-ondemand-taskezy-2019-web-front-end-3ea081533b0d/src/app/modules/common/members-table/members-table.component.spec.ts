import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from 'app/shared/shared.module';
import { MembersTableComponent } from './members-table.component';

describe('MembersTableComponent', () => {
  let component: MembersTableComponent;
  let fixture: ComponentFixture<MembersTableComponent>;

    beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,    
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      declarations: [ MembersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
