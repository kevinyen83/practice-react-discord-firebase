import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MembersComponent } from './members.component';
import { SharedModule } from '../../../shared/shared.module';
import { CommonViewModule } from '../../common/common-view.module';
import { FilterOfMembersComponent } from './filter-of-members/filter-of-members.component';
import { EditMemberComponent } from '../../common/edit-member/edit-member.component';

const routes = [
  {
    path: '',
    component: MembersComponent
  },
  {
    path: ':id',
    component: EditMemberComponent
  }
];

@NgModule({
  declarations: [
    MembersComponent,
    FilterOfMembersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonViewModule
  ]
})
export class MembersModule {}
