export class VenueProfile {
  managed: boolean;
  uuid?: string;
  detail: {
    primaryindustry: string;
    abn: string;
    acn: string;
    name: string;
    tradingname: string;
    entitytype: string;
    website: string;
    phone_numbers: any[];
    emails: any[];
  };
  status: 'Active';
  operations: any[];
  requirements: any[];
  rates: any[];
  resources: any[];
  resourcesHistory: any[];
  resourceWorkData: any[];
  addresses: any[];
  documents: any[];
  accreditation: any[];
  contacts: any[];

  constructor(data?) {
    data = data || {};
    this.uuid = data.uuid;
    this.managed = data.managed || true;
    this.detail = data.detail || {};
    this.status = data.status || '';
    this.operations = data.operations || [];
    this.requirements = data.requirements || [];
    this.rates = data.rates || [];
    this.resources = data.resources || [];
    this.resourcesHistory = data.resourcesHistory || [];
    this.resourceWorkData = data.resourceWorkData || [];
    this.addresses = data.addresses || [];
    this.documents = data.documents || [];
    this.accreditation = data.accreditation || [];
    this.contacts = data.contacts || [];
  }
}
