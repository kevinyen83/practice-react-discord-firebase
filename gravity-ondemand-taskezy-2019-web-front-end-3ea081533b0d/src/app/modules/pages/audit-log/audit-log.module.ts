import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditLogComponent } from './audit-log.component';
import { CommonViewModule } from '../../common/common-view.module';

import { AuditLogDetailsComponent } from './audit-log-details/audit-log-details.component';

const routes: Routes = [
  {
    path: '',
    component: AuditLogComponent
  },
  {
    path: ':id',
    component: AuditLogDetailsComponent
  }
];

@NgModule({
  declarations: [
    AuditLogComponent,
    AuditLogDetailsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonViewModule
  ]
})
export class AuditLogModule {}
