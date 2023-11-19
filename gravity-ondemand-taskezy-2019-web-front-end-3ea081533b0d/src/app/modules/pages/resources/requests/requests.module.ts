import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestsComponent } from './requests.component';
import { FoundSupplierForResourceComponent } from './found-supplier-for-resource/found-supplier-for-resource.component';

const routes: Routes = [
  {
    path     : '',
    component: RequestsComponent
  }
];

@NgModule({
  declarations: [
    RequestsComponent,
    FoundSupplierForResourceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class RequestsModule { }
