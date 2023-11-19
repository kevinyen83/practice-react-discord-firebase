import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { NgApexchartsModule } from "ng-apexcharts";

import { SharedModule } from '../../../shared/shared.module';
import { ModalWelcomeComponent } from './modal-welcome/modal-welcome.component';

const routes: Routes = [
  {
    path     : '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    ModalWelcomeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgApexchartsModule,
    SharedModule
  ],
  providers: []
})
export class HomeModule { }
