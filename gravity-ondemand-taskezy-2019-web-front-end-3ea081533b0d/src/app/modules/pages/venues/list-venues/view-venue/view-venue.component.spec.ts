import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVenueComponent } from './view-venue.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SubViewVenueComponent } from '../../../../common/sub-accounts/sub-view-venue/sub-view-venue.component';
import { TabsDetailComponent } from '../../../../common/tabs-detail/tabs-detail.component';
import { HeaderButtonsComponent } from 'app/modules/common/header-with-buttons/header-with-buttons.component';


describe('ViewVenueComponent', () => {
  let component: ViewVenueComponent;
  let fixture: ComponentFixture<ViewVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ViewVenueComponent,
        SubViewVenueComponent,
        TabsDetailComponent,
        HeaderButtonsComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatIconModule,
      ],
      providers: [
        FuseConfirmationService,
        { provide: MatDialog, useValue: '' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVenueComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
