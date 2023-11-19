export class Account {
  managed: boolean;
  uuid?: string | number;
  id?: string | number;
  detail: {
    industry: string;
    abn: string;
    acn: string;
    name: string;
    tradingname: string;
    logo: string;
    entitytype: string;
    website: string;
    phone: string;
    primary_address: string;
    postal_address: string;
  };
  venues: any[];
  suppliers: any[];
  clients: any[];
  members: any[];
  resources: any[];
  documents: any[];
  invitations: any[];

  constructor(data?) {
    data = data || {};
    this.managed = data.managed || true;
    this.detail = data.detail || {};
    // this.detail.primaryindustry = data.detail.primaryindustry || '';
    // this.detail.abn = data.detail.abn || '';
    // this.detail.acn = data.detail.acn || '';
    // this.detail.name = data.detail.name || '';
    // this.detail.tradingname = data.detail.tradingname || '';
    // this.detail.entitytype = data.detail.entitytype || '';
    // this.detail.phone_numbers = data.detail.phone_numbers || [];
    // this.detail.emails = data.detail.emails || [];
    this.venues = data.venues || [];
    this.suppliers = data.venues || [];
    this.clients = data.venues || [];
    this.members = data.venues || [];
    this.resources = data.venues || [];
    this.documents = data.documents || [];
    this.invitations = data.invitations || [];
  }
}
