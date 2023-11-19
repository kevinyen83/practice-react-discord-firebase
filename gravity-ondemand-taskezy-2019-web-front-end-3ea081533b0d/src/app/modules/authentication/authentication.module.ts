import { LayoutModule } from './../../layout/layout.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginModule } from './login/login.module';
import { AuthRegisterModule } from './register/register.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { MobileVerificationModule } from './mobile-verification/mobile-verification.module';
import { IDCheckModule } from './id-check/id-check.module';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';

const routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'verify-email',
    loadChildren: () => import('app/modules/authentication/email-verification/email-verification.module').then((m) => m.EmailVerificationModule)
  },
  {
    path: 'verify-mobile',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/modules/authentication/mobile-verification/mobile-verification.module').then((m) => m.MobileVerificationModule)
  },
  {
    path: 'id-check',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/modules/authentication/id-check/id-check.module').then((m) => m.IDCheckModule)
  },
  {
    path: 'forgot-password',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('app/modules/authentication/forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule)
  },
  {
    path: 'reset-password',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('app/modules/authentication/reset-password/reset-password.module').then((m) => m.ResetPasswordModule)
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('app/modules/authentication/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('app/modules/authentication/register/register.module').then((m) => m.AuthRegisterModule)
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    LoginModule,
    AuthRegisterModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    EmailVerificationModule,
    MobileVerificationModule,
    IDCheckModule,
    SharedModule,
    LayoutModule
  ],
  exports: []
})
export class AuthenticationModule {}
