import { SharedModule } from 'app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FuseAlertModule } from '@fuse/components/alert';

import { DocumentsFormComponent } from './documents-form/documents-form.component';
import { DocumentsViewComponent } from './documents-view/documents-view.component';
import { LocationsComponent } from './locations/locations.component';
import { AddVenueComponent } from './sub-accounts/add-venue/add-venue.component';
import { AddResourceComponent } from './sub-accounts/add-resource/add-resource.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { StarRatingControlComponent } from './star-rating-control/star-rating-control.component';
import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { SubAccountDetailsComponent } from './sub-accounts/sub-account-details/sub-account-details.component';
import { AddingResourcesComponent } from './sub-accounts/adding-resources/adding-resources.component';
import { ListMembersComponent } from './sub-accounts/list-members/list-members.component';
import { AddingDocumentsComponent } from './sub-accounts/adding-documents/adding-documents.component';
import { EngagementDocumentsComponent } from './sub-accounts/engagement-documents/engagement-documents.component';
import { ChooseFilesComponent } from './sub-accounts/choose-files/choose-files.component';
import { ResourcesForSubAccountsComponent } from './sub-accounts/resources-for-sub-accounts/resources-for-sub-accounts.component';
import { MembersTableComponent } from './members-table/members-table.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { EndOfShiftReportsComponent } from './end-of-shift-reports/end-of-shift-reports.component';
import { ContractDetailsComponent } from './sub-accounts/engagement-documents/contract-details/contract-details.component';
import { ListAccordionsComponent } from './sub-accounts/engagement-documents/list-accordions/list-accordions.component';
import { TableLicenceComponent } from './sub-accounts/engagement-documents/list-accordions/table-licence/table-licence.component';
import { AddAccreditationModalComponent } from './sub-accounts/engagement-documents/list-accordions/add-accreditation-modal/add-accreditation-modal.component';
import { PasteUrlComponent } from './sub-accounts/paste-url/paste-url.component';
import { SubListVenuesUserComponent } from './sub-accounts/sub-list-venues/sub-list-venues.component';
import { VenueManagersComponent } from './venue-managers/venue-managers.component';
import { VenueComplianceComponent } from './venue-compliance/venue-compliance.component';
import { ResourceRolesComponent } from './resource-roles/resource-roles.component';
import { ListAccreditationsComponent } from './list-accreditations/list-accreditations.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SearchHeaderForUsersComponent } from './search-header-for-users/search-header-for-users.component';
import { DocumentsComponent } from './documents/documents.component';
import { AddAccreditationToRoleComponent } from './add-accreditation-to-role/add-accreditation-to-role.component';
import { AccreditationsContentComponent } from './accreditations-content/accreditations-content.component';
import { AddRateWindowComponent } from './add-rate-window/add-rate-window.component';
import { TabsDetailComponent } from './tabs-detail/tabs-detail.component';
import { SubViewVenueComponent } from './sub-accounts/sub-view-venue/sub-view-venue.component';
import { DetailsFormComponent } from './sub-accounts/details-form/details-form.component';
import { VenueDetailsComponent } from './sub-accounts/venue-details/venue-details.component';
import { InviteMembersFormArrayComponent } from './invite-members-form-array/invite-members-form-array.component';
import { VerifyingNowComponent } from './verifying-now/verifying-now.component';
import { AuthorityVerificationComponent } from './authority-verification/authority-verification.component';
import { ReplaceAdministratorComponent } from './sub-accounts/replace-administrator/replace-administrator.component';
import { AddShiftRoleWindowComponent } from './add-shift-role-window/add-shift-role-window.component';
import { AddVenueManagerComponent } from './add-venue-manager/add-venue-manager.component';
import { EditDocumentComponent } from './sub-accounts/edit-document/edit-document.component';
import { FileIconComponent } from './file-icon/file-icon.component';
import { AuthorityInviteModalComponent } from './authority-invite-modal/authority-invite-modal.component';
import { ResourceDetailsComponent } from './sub-accounts/resource-details/resource-details.component';
import { ReportsTabComponent } from './sub-accounts/reports-tab/reports-tab.component';
import { RosterDetailsComponent } from './sub-accounts/roster-details/roster-details.component';
import { ResourceAssessmentsComponent } from './sub-accounts/resource-assessments/resource-assessments.component';
import { ResourceInterviewsComponent } from './sub-accounts/resource-interviews/resource-interviews.component';
import { ResourceLicencesComponent } from './sub-accounts/resource-licences/resource-licences.component';
import { ResourceChargeRatesComponent } from './sub-accounts/resource-charge-rates/resource-charge-rates.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MAT_RADIO_DEFAULT_OPTIONS } from "@angular/material/radio";
import { AddAccreditationComponent } from './sub-accounts/add-accreditation/add-accreditation.component';
import { HeaderButtonsComponent } from './header-with-buttons/header-with-buttons.component';
import { ButtonsDetailPageComponent } from './buttons-in-shared-header/buttons-detail-page/buttons-detail-page.component';
import { ButtonsDetailAcrreditationsPageComponent } from './buttons-in-shared-header/buttons-detail-acrreditations-page/buttons-detail-acrreditations-page.component';
import { ButtonsVenuesDetailPageComponent } from './buttons-in-shared-header/buttons-venues-detail-page/buttons-venues-detail-page.component';
import { ButtonsClientsDetailsComponent } from './buttons-in-shared-header/buttons-clients-details/buttons-clients-details.component';
import { ButtonsClientsVenuesComponent } from './buttons-in-shared-header/buttons-clients-venues/buttons-clients-venues.component';
import { ButtonsClientsVenuesDetailsComponent } from './buttons-in-shared-header/buttons-clients-venues-details/buttons-clients-venues-details.component';
import { ButtonsResourcesDetailsActiveComponent } from './buttons-in-shared-header/buttons-resources-details-active/buttons-resources-details-active.component';
import { ButtonsCreateNewClientsSuppliersComponent } from './buttons-in-shared-header/buttons-create-new-clients-suppliers/buttons-create-new-clients-suppliers.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { FilterClientSupplierComponent } from './filter-client-supplier/filter-client-supplier.component';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'l'
  },
  display: {
    dateInput: 'l',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    DetailsFormComponent,
    DocumentsFormComponent,
    DocumentsViewComponent,
    LocationsComponent,
    AddVenueComponent,
    AddResourceComponent,
    ViewDocumentComponent,
    StarRatingControlComponent,
    SignatureFieldComponent,
    SubAccountDetailsComponent,
    SubListVenuesUserComponent,
    AddingResourcesComponent,
    ListMembersComponent,
    AddingDocumentsComponent,
    EngagementDocumentsComponent,
    ChooseFilesComponent,
    ResourcesForSubAccountsComponent,
    EndOfShiftReportsComponent,
    MembersTableComponent,
    ResourceAssessmentsComponent,
    EditMemberComponent,
    ContractDetailsComponent,
    ListAccordionsComponent,
    TableLicenceComponent,
    AddAccreditationModalComponent,
    PasteUrlComponent,
    VenueManagersComponent,
    ReportsTabComponent,
    VenueComplianceComponent,
    ResourceRolesComponent,
    ListAccreditationsComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    ResourceLicencesComponent,
    SearchHeaderForUsersComponent,
    DocumentsComponent,
    AddAccreditationToRoleComponent,
    AccreditationsContentComponent,
    AddRateWindowComponent,
    TabsDetailComponent,
    RosterDetailsComponent,
    SubViewVenueComponent,
    ResourceDetailsComponent,
    VenueDetailsComponent,
    VerifyingNowComponent,
    ResourceInterviewsComponent,
    ResourceChargeRatesComponent,
    ImagePreviewComponent,
    ConfirmModalComponent,
    AuthorityVerificationComponent,
    InviteMembersFormArrayComponent,
    ReplaceAdministratorComponent,
    AddShiftRoleWindowComponent,
    AddVenueManagerComponent,
    EditDocumentComponent,
    FileIconComponent,
    AuthorityInviteModalComponent,
    AddAccreditationComponent,
    HeaderButtonsComponent,
    ButtonsDetailPageComponent,
    ButtonsDetailAcrreditationsPageComponent,
    ButtonsVenuesDetailPageComponent,
    ButtonsClientsDetailsComponent,
    ButtonsClientsVenuesComponent,
    ButtonsClientsVenuesDetailsComponent,
    ButtonsResourcesDetailsActiveComponent,
    ButtonsCreateNewClientsSuppliersComponent,
    FilterClientSupplierComponent
  ],
  imports: [
    SharedModule,
    FuseAlertModule
    // BrowserAnimationsModule
  ],
  exports: [
    DetailsFormComponent,
    DocumentsFormComponent,
    DocumentsViewComponent,
    LocationsComponent,
    ViewDocumentComponent,
    StarRatingControlComponent,
    SignatureFieldComponent,
    SubAccountDetailsComponent,
    SubListVenuesUserComponent,
    AddingDocumentsComponent,
    AddVenueComponent,
    ResourcesForSubAccountsComponent,
    RosterDetailsComponent,
    MembersTableComponent,
    EditMemberComponent,
    ResourceLicencesComponent,
    ResourceInterviewsComponent,
    EngagementDocumentsComponent,
    EndOfShiftReportsComponent,
    ResourceAssessmentsComponent,
    VenueManagersComponent,
    ResourceChargeRatesComponent,
    ImagePreviewComponent,
    ConfirmModalComponent,
    ResourceDetailsComponent,
    ReportsTabComponent,
    VenueComplianceComponent,
    ResourceRolesComponent,
    ListAccreditationsComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    SearchHeaderForUsersComponent,
    DocumentsComponent,
    AccreditationsContentComponent,
    TabsDetailComponent,
    SubViewVenueComponent,
    VenueDetailsComponent,
    ChooseFilesComponent,
    VerifyingNowComponent,
    AuthorityVerificationComponent,
    InviteMembersFormArrayComponent,
    ReplaceAdministratorComponent,
    FileIconComponent,
    AuthorityInviteModalComponent,
    AddAccreditationComponent,
    HeaderButtonsComponent,
    ButtonsDetailPageComponent,
    ButtonsDetailAcrreditationsPageComponent,
    ButtonsVenuesDetailPageComponent,
    ButtonsClientsDetailsComponent,
    ButtonsClientsVenuesComponent,
    ButtonsClientsVenuesDetailsComponent,
    ButtonsResourcesDetailsActiveComponent,
    ButtonsCreateNewClientsSuppliersComponent,
    FilterClientSupplierComponent
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonViewModule {}
