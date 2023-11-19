export class RosterShiftModel {
  uuid: string;
  profile_id: string;
  datetime: string;
  duration: number;
  address: string;
  location: string;
  geolocation: any;
  notes: any;
  supervisor: boolean;
  client: any;
  supplier: any;
  resource: any;

  constructor(data?) {
    data = data || {};
    this.uuid = data.uuid || '';
    this.profile_id = data.profile_id || '';
    this.datetime = data.datetime || new Date();
    this.duration = data.duration || 60;
    this.address = data.address || '';
    this.location = data.location || '';
    this.geolocation = data.geolocation || {
      type: 'Point',
      coordinates: [
        0,
        0
      ]
    };
    this.notes = data.notes || [];
    this.supervisor = data.supervisor || false;
    this.client = data.client || {};
    this.supplier = data.supplier || {};
    this.resource = data.resource || {};
  }
}
