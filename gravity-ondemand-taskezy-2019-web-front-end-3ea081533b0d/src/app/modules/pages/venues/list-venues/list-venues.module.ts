import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListVenuesComponent } from './list-venues.component';
import { CommonViewModule } from '../../../common/common-view.module';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { FiltersForVenuesComponent } from '../filters-for-venues/filters-for-venues.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ViewVenueComponent } from './view-venue/view-venue.component';

const routes: Routes = [
  {
    path: '',
    component: ListVenuesComponent
  },
  {
    path: ':id',
    component: ViewVenueComponent
  }
];

@NgModule({
  declarations: [
    ListVenuesComponent,
    CreateVenueComponent,
    FiltersForVenuesComponent,
    ViewVenueComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    GoogleMapsModule,
    CommonViewModule,
    FuseAlertModule
  ]
})
export class ListVenuesModule {}
