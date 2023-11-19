import { SharedModule } from 'app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutModule } from 'app/layout/layout.module';
import { PrimaryAccountModule } from './primary-account/primary-account.module';
import { CommonViewModule } from '../common/common-view.module';
import { TaskChecklistComponent } from './venues/task-checklist/task-checklist.component';
import { AddRoleComponent } from './venues/add-role/add-role.component';

const routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'primary-account',
    loadChildren: () => import('./primary-account/primary-account.module').then((m) => m.PrimaryAccountModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./my-profile/my-profile.module').then((m) => m.MyProfileModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./primary-account/details-page/primary-account-details.module').then((m) => m.DetailsPageModule)
  },
  {
    path: 'audit-log',
    loadChildren: () => import('./audit-log/audit-log.module').then((m) => m.AuditLogModule)
  },
  {
    path: 'timesheet-register',
    loadChildren: () => import('./timesheet-register/timesheet-register.module').then((m) => m.TimesheetRegisterModule)
  },
  {
    path: 'incident-reporting',
    loadChildren: () => import('./incidents/incident-reporting/incident-reporting.module').then((m) => m.IncidentReportingModule)
  },
  {
    path: 'roster',
    loadChildren: () => import('./roster/roster.module').then((m) => m.RosterModule)
  },
  // {
  //   path: 'resource-interviews',
  //   loadChildren: () => import('./resources/resource-interviews/resource-interviews.module').then((m) => m.ResourceInterviewsModule)
  // },
  {
    path: 'list-resources',
    loadChildren: () => import('./resources/list-resources/list-resources.module').then((m) => m.ListResourcesModule)
  },
  // {
  //   path: 'resource-pool',
  //   loadChildren: () => import('./resource-pool/resource-pool.module').then((m) => m.ResourcePoolModule)
  // },
  // {
  //   path: 'requests',
  //   loadChildren: () => import('./resources/requests/requests.module').then((m) => m.RequestsModule)
  // },
  // {
  //   path: 'resources-compliance',
  //   loadChildren: () => import('./resources/resources-compliance/resources-compliance.module').then((m) => m.ResourcesComplianceModule)
  // },
  {
    path: 'list-clients',
    loadChildren: () => import('./clients/list-clients/list-clients.module').then((m) => m.ListClientsModule)
  },
  // {
  //   path: 'client-requests',
  //   loadChildren: () => import('./clients/client-requests/client-requests.module').then((m) => m.ClientRequestsModule)
  // },
  {
    path: 'list-venues',
    loadChildren: () => import('./venues/list-venues/list-venues.module').then((m) => m.ListVenuesModule)
  },
  {
    path: 'list-members',
    loadChildren: () => import('./members/members.module').then((m) => m.MembersModule)
  },
  {
    path: 'list-suppliers',
    loadChildren: () => import('./suppliers/list-suppliers/list-suppliers.module').then((m) => m.ListSuppliersModule)
  },
  // {
  //   path: 'suppliers-requests',
  //   loadChildren: () => import('./suppliers/suppliers-requests/suppliers-requests.module').then((m) => m.SuppliersRequestsModule)
  // },
  // {
  //   path: 'supplier-compliance',
  //   loadChildren: () => import('./suppliers/supplier-compliance/supplier-compliance.module').then((m) => m.SupplierComplianceModule)
  // },
  // {
  //   path: 'interviews',
  //   loadChildren: () => import('./interviews/interviews.module').then((m) => m.InterviewsModule)
  // },
  // {
  //   path: 'forms',
  //   loadChildren: () => import().then((m) => m.)
  // },
  // {
  //   path: 'notifications',
  //   loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule)
  // },
  {
    path: 'error',
    children: [
      { path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then((m) => m.Error404Module) },
      { path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then((m) => m.Error500Module) }
    ]
  },
  { path: '', redirectTo: '/pages/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/pages/error/404', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonViewModule,
    PrimaryAccountModule,
    SharedModule,
    LayoutModule
  ],
  declarations: [
    TaskChecklistComponent,
    AddRoleComponent
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {}
