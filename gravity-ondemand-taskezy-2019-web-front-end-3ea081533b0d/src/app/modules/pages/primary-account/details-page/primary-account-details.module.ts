import { SharedModule } from 'app/shared/shared.module';
import { CommonViewModule } from '../../../common/common-view.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { PrimaryAccountDetailsComponent } from "./primary-account-details.component";
import { ConfirmDeactivateGuard, DetailsTabComponent } from './details-tab/details-tab.component';
import { SubscriptionTabComponent } from './subscription-tab/subscription-tab.component';
import { ModifyPaymentMethodComponent } from './subscription-tab/modify-payment-method/modify-payment-method.component';
import { InvoicesModalComponent } from './subscription-tab/invoices-modal/invoices-modal.component';
import { AccreditationsTabComponent } from './accreditations-tab/accreditations-tab.component';
import { AccountInvitesTabComponent } from './account-invites-tab/account-invites-tab.component';

const routes: Routes = [
  {
    path: '**',
    component: PrimaryAccountDetailsComponent,
    canDeactivate: [ConfirmDeactivateGuard]
  }
];

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    PrimaryAccountDetailsComponent,
    DetailsTabComponent,
    SubscriptionTabComponent,
    ModifyPaymentMethodComponent,
    InvoicesModalComponent,
    AccreditationsTabComponent,
    AccountInvitesTabComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonViewModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmDeactivateGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DetailsPageModule {}
