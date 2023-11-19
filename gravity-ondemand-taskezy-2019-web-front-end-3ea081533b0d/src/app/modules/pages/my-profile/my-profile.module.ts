import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyProfileComponent } from './my-profile.component';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FileSaverModule } from 'ngx-filesaver';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MY_FORMATS } from '../primary-account/details-page/primary-account-details.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { CommonViewModule } from '../../common/common-view.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

const routes: Routes = [
  {
    path: '',
    component: MyProfileComponent
  }
];

@NgModule({
  declarations: [
    MyProfileComponent,
    EditProfileComponent,
    AvatarUploadComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonViewModule,
    FileSaverModule,
    SharedModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class MyProfileModule {}
