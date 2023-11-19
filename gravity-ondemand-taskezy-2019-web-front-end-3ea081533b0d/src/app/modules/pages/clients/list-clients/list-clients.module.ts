import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import {  MY_FORMATS } from '../../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { ListClientsComponent } from './list-clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { SubAccountFormModule } from '../../../common/sub-accounts/sub-account-form/sub-account-form.module';
import { ExcelService } from '../../roster/excel.service';
import { SharedModule } from '../../../../shared/shared.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { CommonViewModule } from '../../../common/common-view.module';
import { ViewClientComponent } from './view-client/view-client.component';
import {HeaderButtonService} from "../../../../core/services/header-with-button/header-with-button.service";
import {DetailsTabComponent} from "../../primary-account/details-page/details-tab/details-tab.component";
import {DetailsFormComponent} from "../../../common/sub-accounts/details-form/details-form.component";

const routes: Routes = [
  {
    path: '',
    component: ListClientsComponent
  },
  {
    path: ':id',
    component: ViewClientComponent
  }
];

@NgModule({
  declarations: [
    ListClientsComponent,
    ViewClientComponent,
    CreateClientComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    SubAccountFormModule,
    FuseAlertModule,
    CommonViewModule
  ],
  exports: [],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ExcelService,
    HeaderButtonService,
    DetailsTabComponent,
    DetailsFormComponent
  ]
})
export class ListClientsModule {}
