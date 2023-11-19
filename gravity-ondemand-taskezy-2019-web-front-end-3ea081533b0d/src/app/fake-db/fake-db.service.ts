import { InMemoryDbService } from 'angular-in-memory-web-api';

import { HomeStatisticsFakeDb } from './home-statistics';
import { RegisterUserFakeDb } from './register-user';
import { LoginUserFakeDb } from './login-user';
import { ForgotPasswordFakeDb } from './forgot-password';
import { ResetPasswordFakeDb } from './reset-password';
import { RosterTasksFakeDb } from './roster-tasks';
import { IncidentsFakeDb } from './incidents';
import { AccountsFakeDb } from './accounts';
import { DocumentsNotes } from './documents&notes';
import { ClientsFakeDb } from './clients';
import { AdminsFakeDb } from './admins';
import { SuppliersFakeDb } from './suppliers';
import { UploadFilesFakeDb } from './upload-files';
import { ResourcesFakeDb } from './resources';
import { InterviewsResourcesFakeDb } from './interviews-resources';
import { ComplianceFakeDb } from './compliance';
import { SuppliersResources } from './suppliers-resources';
import { VerifyEmailFakeDb } from './verify-email';
import { ResendVerificationFakeDb } from './resend-verification';
import { InvitationsFakeDb } from './invitations';
import { AuditLogFakeDb } from './audit-log';
import { IncidentReportSchema } from './incident-report-schema';
import { ReportsFakeDb } from './reports';
import { LocationsFakeDb } from './locations';
import { VenuesFakeDb } from './venues';
import { ComplianceAndOperationsFakeDb } from './complianceAndOperations';
import { InductionRequirementsFakeDb } from './inductionRequirements';
import { CriteriaRatesFakeDb } from './criteriaRates';
import { ResourcesHistoryFakeDb } from './resourcesHistory';
import { IncidentHistoryFakeDb } from './incidentHistory';
import { VenueResourcesFakeDb } from './venueResources';
import { ResourceWorkDataFakeDb } from './resourceWorkData';
import { TemplatesFakeDb } from './templates';
import { AssessmentsFakeDb } from './assessments';
import { InterviewsAdmin } from './interviews-admin';
// import { AccountsFakeDb } from './accounts';
import { ContactsFakeDb } from './contacts';
import { PaymentPlaneFakeDb } from './payment-plane';
import { MembersFakeDb } from './members';
import { planeOfUserFakeDb } from './planeOfUser';
import { ListAccreditationsFakeDb } from './list-accreditations';
import { RolesOfResourcesFakeDb } from './roles-of-resources';
import { ResourceInductionsFakeDb } from './resource-inductions';
import { ResourceRatesFakeDb } from './resource-rates';
import { ResourceAccreditationsFakeDb } from './resource-accreditations';
import { ExternalInvitationsFakeDb } from './external-invitations';
import { ConnectedVenuesFakeDb } from './connectedVenues';
import { ShiftRolesFakeDb } from './shift-roles';

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Statistic
      statistics: HomeStatisticsFakeDb.statistics,

      // Authentication
      register: RegisterUserFakeDb.users,
      login: LoginUserFakeDb.users,
      refresh: LoginUserFakeDb.refresh,
      'forgot-password': ForgotPasswordFakeDb.users,
      'reset-password': ResetPasswordFakeDb.users,
      verify: VerifyEmailFakeDb.users,
      'verify-email': ResendVerificationFakeDb.users,

      // Accounts
      accounts: AccountsFakeDb.accounts,
      'account-formdata': AccountsFakeDb.formData,
      compliance: ComplianceFakeDb.accreditations,
      'compliance-security-nsw': ComplianceFakeDb.securityLicences,
      'compliance-abn': ComplianceFakeDb.abn,
      'compliance-acn': ComplianceFakeDb.acn,

      // Invite
      invitations: InvitationsFakeDb.invitations,
      'external-invitations': ExternalInvitationsFakeDb.externalInvites,

      // Admins
      admins: AdminsFakeDb.admins,

      //Audit Log
      auditlog: AuditLogFakeDb.logs,

      // My account
      'plan-account': planeOfUserFakeDb.plane,
      invoices: planeOfUserFakeDb.invoices,
      'controls-accounts': TemplatesFakeDb.controlsOfModal,

      // Documents
      documents: DocumentsNotes.documents,
      files: UploadFilesFakeDb.files,

      // Incidents
      incidents: IncidentsFakeDb.incidents,
      'incident-schema': IncidentReportSchema.schema,
      reports: ReportsFakeDb.reports,

      map: LocationsFakeDb.locations,

      // Clients
      clients: ClientsFakeDb.clients,
      entitytypes: ClientsFakeDb.entitytypes,
      controls: ClientsFakeDb.controlsWASecurity,
      types: ClientsFakeDb.typesWALiquor,
      accreditationTypes: ClientsFakeDb.accreditationTypes,
      contacts: ContactsFakeDb.contacts,

      'list-accreditations': ListAccreditationsFakeDb.accreditations,
      'roles-resources': RolesOfResourcesFakeDb.roles,

      // Venues
      connectedVenues: ConnectedVenuesFakeDb.venues,
      venues: VenuesFakeDb.venues,
      venuesDataTables: VenuesFakeDb.dataTables,
      venueResources: VenueResourcesFakeDb.resources,
      members: MembersFakeDb.members,
      'shift-roles': ShiftRolesFakeDb.roles,

      // Templates
      'assessment-templates': TemplatesFakeDb.templates,
      // 'register-data'       : TemplatesFakeDb.dataRegisterPage,
      assessments: AssessmentsFakeDb.assessments,
      operations: ComplianceAndOperationsFakeDb.operations,
      requirements: InductionRequirementsFakeDb.requirements,
      rates: CriteriaRatesFakeDb.rates,
      histories: ResourcesHistoryFakeDb.history,
      incidentHistories: IncidentHistoryFakeDb.histories,
      resourcesBreakdown: ResourceWorkDataFakeDb.workData,
      // Suppliers
      suppliers: SuppliersFakeDb.suppliers,

      // Roster
      'roster-tasks': RosterTasksFakeDb.tasks,
      'suppliers-resources': SuppliersResources.suppliers,

      // Resources
      resources: ResourcesFakeDb.resources,
      'resource-inductions': ResourceInductionsFakeDb.inductions,
      'resource-rates': ResourceRatesFakeDb.rates,
      'resource-accreditations': ResourceAccreditationsFakeDb.accreditations,
      resourcesRequirements: ResourcesFakeDb.venueResourceRequirements,
      controlsForNSWSecurityLicence: ResourcesFakeDb.controlsForNSWSecurityLicence,
      controlsForNSWResponsibleServiceOfAlcohol: ResourcesFakeDb.controlsForNSWResponsibleServiceOfAlcohol,
      controlsForVIKSecurityLicence: ResourcesFakeDb.controlsForVIKSecurityLicence,
      controlsForVICResponsibleServiceOfAlcohol: ResourcesFakeDb.controlsForVICResponsibleServiceOfAlcohol,
      controlsForQLDSecurityLicence: ResourcesFakeDb.controlsForQLDSecurityLicence,
      controlsForQLDResponsibleServiceOfAlcohol: ResourcesFakeDb.controlsForQLDResponsibleServiceOfAlcohol,
      controlsForWASecurityLicence: ResourcesFakeDb.controlsForWASecurityLicence,
      controlsForWAResponsibleServOfAlcohol: ResourcesFakeDb.controlsForWAResponsibleServOfAlcohol,

      // Interviews
      'interviews-admin': InterviewsAdmin.interviews,
      'interview-templates': InterviewsAdmin.templates,
      'interviews-resources': InterviewsResourcesFakeDb.interviews,
      // Notifications
      // 'notifications'        : NotificationsFakeDb.notifications

      // Payment Plane

      planesMonth: PaymentPlaneFakeDb.planesMonth,
      planesYear: PaymentPlaneFakeDb.planesYear
    };
  }
}
