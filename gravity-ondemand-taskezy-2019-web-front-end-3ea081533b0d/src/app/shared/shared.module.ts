import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';

import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';

import { NgPipesModule } from 'ngx-pipes';
import { AuthFooterComponent } from 'app/modules/authentication/auth-footer/auth-footer.component';
import { AuthLayoutComponent } from 'app/modules/authentication/auth-layout/auth-layout.component';
import { NgxTimeSchedulerModule } from 'ngx-time-scheduler-extend';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { GoogleMapsModule } from '@angular/google-maps';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseConfirmationModule, FuseConfirmationService } from '../../@fuse/services/confirmation';
import { FileSizePipe } from './pipes/filesize.pipe';
import { FileDropDirective } from './directives/fileDrop/fileDrop.directive';
import { RoundUpPipe } from './pipes/roundUp.pipe'
import { FilterClientSupplier } from './pipes/filterClientSupplier.pipe';
import { MtxSelectModule } from '@ng-matero/extensions/select';
@NgModule({
  declarations: [AuthFooterComponent, AuthLayoutComponent, FileSizePipe, FileDropDirective,RoundUpPipe,FilterClientSupplier],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDividerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatExpansionModule,
    DragDropModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatDialogModule,
    MatSidenavModule,
    NgPipesModule,
    NgxTimeSchedulerModule,
    NgxMatIntlTelInputModule,
    NgxCurrencyModule,
    NgxMaterialTimepickerModule,
    GoogleMapsModule,
    FuseAlertModule,
    FuseCardModule,
    FuseDrawerModule,
    FuseFullscreenModule,
    FuseHighlightModule,
    FuseLoadingBarModule,
    FuseConfirmationModule,
    ContextMenuModule
  ],
  providers: [FuseConfirmationService],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDividerModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatStepperModule,
    MatDialogModule,
    MatSidenavModule,
    NgPipesModule,
    NgxTimeSchedulerModule,
    NgxMatIntlTelInputModule,
    NgxCurrencyModule,
    NgxMaterialTimepickerModule,
    AuthFooterComponent,
    AuthLayoutComponent,
    GoogleMapsModule,
    FuseAlertModule,
    FuseCardModule,
    FuseDrawerModule,
    FuseFullscreenModule,
    FuseHighlightModule,
    FuseLoadingBarModule,
    FileSizePipe,
    FileDropDirective,
    RoundUpPipe,
    FilterClientSupplier,
    MtxSelectModule
  ]
})
export class SharedModule {}
