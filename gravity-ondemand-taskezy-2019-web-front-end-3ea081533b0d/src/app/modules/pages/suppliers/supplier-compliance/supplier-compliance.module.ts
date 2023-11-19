import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { SupplierComplianceComponent } from './supplier-compliance.component';
import { SearchSupplierCompliancePipe } from '../../../../core/pipes/search-supplier-compliance.pipe';

const routes: Routes = [
  {
    path     : '',
    component: SupplierComplianceComponent
  }
];

@NgModule({
  declarations: [
    SupplierComplianceComponent,
    SearchSupplierCompliancePipe
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
  ]
})
export class SupplierComplianceModule { }
