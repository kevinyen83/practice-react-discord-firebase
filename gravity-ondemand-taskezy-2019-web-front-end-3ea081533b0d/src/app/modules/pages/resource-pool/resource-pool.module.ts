import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcePoolComponent } from './resource-pool.component';

const routes: Routes = [
  {
    path     : '',
    component: ResourcePoolComponent
  }
];


@NgModule({
  declarations: [
    ResourcePoolComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class ResourcePoolModule {}
