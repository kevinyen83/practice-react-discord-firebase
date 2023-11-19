import { SharedModule } from 'app/shared/shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// import { HeaderButtonService } from "../../../../core/services/header-with-button/header-with-button.service";
import { ListVenuesComponent } from './list-venues.component';
import { CommonViewModule } from '../../../common/common-view.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FiltersForVenuesComponent } from '../filters-for-venues/filters-for-venues.component';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { AddVenueComponent } from '../../../common/sub-accounts/add-venue/add-venue.component';

describe('ListVenuesComponent', () => {
  let component: ListVenuesComponent;
  let fixture: ComponentFixture<ListVenuesComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        CommonViewModule
      ],
      declarations: [
        ListVenuesComponent,
        FiltersForVenuesComponent,
        CreateVenueComponent
      ],
      providers: [FuseConfirmationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
