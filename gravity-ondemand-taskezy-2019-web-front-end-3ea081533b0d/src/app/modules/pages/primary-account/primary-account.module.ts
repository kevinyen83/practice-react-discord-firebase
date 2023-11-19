import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonViewModule } from '../../common/common-view.module';

import { FuseAlertModule } from '@fuse/components/alert';
import { NgxStripeModule } from 'ngx-stripe';

import { SharedModule } from '../../../shared/shared.module';
import { PrimaryAccountComponent } from './primary-account.component';
import { CreateAccountModalComponent } from './create-account-modal/create-account-modal.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { PaymentPlaneComponent } from './payment-plane/payment-plane.component';
import { AddPaymentPlaneComponent } from './add-payment-plane/add-payment-plane.component';

const routes = [
  {
    path: 'primary-account',
    component: PrimaryAccountComponent
  }
];

@NgModule({
  declarations: [
    PrimaryAccountComponent,
    CreateAccountModalComponent,
    AccountInformationComponent,
    PaymentPlaneComponent,
    AddPaymentPlaneComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonViewModule,
    NgxStripeModule.forChild(),
    FuseAlertModule
  ],
  providers: [],
  exports: []
})
export class PrimaryAccountModule {}
