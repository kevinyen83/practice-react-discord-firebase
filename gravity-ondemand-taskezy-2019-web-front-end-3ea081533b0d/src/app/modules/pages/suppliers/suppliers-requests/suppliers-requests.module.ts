import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SuppliersRequestsComponent } from './suppliers-requests.component';

import { FoundSupplierComponent } from './found-supplier/found-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: SuppliersRequestsComponent
  }
];

@NgModule({
  declarations: [
    SuppliersRequestsComponent,
    FoundSupplierComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SuppliersRequestsModule {}
