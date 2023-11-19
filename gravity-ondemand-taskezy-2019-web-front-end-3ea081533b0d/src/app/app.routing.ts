import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { Routes } from '@angular/router';
import { InitialDataResolver } from './app.resolvers';
import { AuthAccountGuard } from './core/auth/guards/authAccount.guard';

export const appRoutes: Routes = [
  // Auth routes for guests
  {
    path: 'auth',
    // canActivate: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    loadChildren: () => import('app/modules/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },

  // Auth routes for logged in
  {
    path: 'pages',
    canActivate: [AuthAccountGuard],
    canActivateChild: [AuthAccountGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver
    },
    data: {
      // layout: 'classy'
    },
    loadChildren: () => import('./modules/pages/pages.module').then((m) => m.PagesModule)
  },
  {
    path: 'welcome',
    canActivate: [AuthAccountGuard],
    // canActivateChild: [AuthAccountGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver
    },
    data: {
      layout: 'empty'
    },
    loadChildren: () => import('app/modules/pages/welcome/welcome.module').then((m) => m.WelcomeModule)
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver
    },
    data: {
      layout: 'empty'
    },
    loadChildren: () => import('./modules/pages/primary-account/primary-account.module').then((m) => m.PrimaryAccountModule)
  },
  // 404 & Catch all
  {
    path: '404-not-found',
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then((m) => m.Error404Module)
  },
  { path: '', redirectTo: '/pages/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404-not-found' }
];
