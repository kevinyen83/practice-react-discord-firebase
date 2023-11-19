import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientRequestsComponent } from './client-requests.component';
import { FoundUsersComponent } from './found-users/found-users.component';

const routes: Routes = [
  {
    path     : '',
    component: ClientRequestsComponent
  }
];

@NgModule({
  declarations: [
    ClientRequestsComponent,
    FoundUsersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ClientRequestsModule { }
