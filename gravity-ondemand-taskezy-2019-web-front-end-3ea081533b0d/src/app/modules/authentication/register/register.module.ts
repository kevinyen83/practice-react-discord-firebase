import { SharedModule } from 'app/shared/shared.module';
import { FuseAlertModule } from '@fuse/components/alert/alert.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from "@angular/common";

import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

import { RegisterComponent } from './register.component';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY-MM-DD"
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "YYYY-MM-DD",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

const routes = [
  {
    path     : 'register',
    canActivate: [NoAuthGuard],
    component: RegisterComponent
  },
  {
    path     : 'register/:name',
    canActivate: [NoAuthGuard],
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FuseAlertModule,
    MatMomentDateModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ]
})
export class AuthRegisterModule { }
