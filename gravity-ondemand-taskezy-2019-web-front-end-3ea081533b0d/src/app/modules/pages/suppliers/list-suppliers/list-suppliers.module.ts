import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { ListSuppliersComponent } from './list-suppliers.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { SubAccountFormModule } from '../../../common/sub-accounts/sub-account-form/sub-account-form.module';
import { ExcelService } from '../../roster/excel.service';
import { SharedModule } from '../../../../shared/shared.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { CommonViewModule } from '../../../common/common-view.module';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: ListSuppliersComponent
  },
  {
    path: ':id',
    component: ViewSupplierComponent
  }
];

@NgModule({
  declarations: [
    ListSuppliersComponent,
    CreateSupplierComponent,
    ViewSupplierComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    SubAccountFormModule,
    FuseAlertModule,
    CommonViewModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ExcelService

  ]
})
export class ListSuppliersModule {}
