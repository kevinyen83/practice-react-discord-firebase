import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Error404Component } from 'app/modules/admin/pages/error/error-404/error-404.component';

export const error404Routes: Route[] = [
  {
      path     : '',
      component: Error404Component
  }
];

@NgModule({
    declarations: [
        Error404Component
    ],
    imports     : [
        RouterModule.forChild(error404Routes)
    ]
})
export class Error404Module
{
}
