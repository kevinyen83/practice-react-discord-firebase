import * as moment from 'moment';

export class IncidentsFakeDb {
  public static incidents = [
    {
      id: '1',
      client: 'Great Man',
      clientAddress: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
      reportedBy: 'Henry Fog',
      dateOfIncident: moment().format(),
      venueLicenceNumber: '55180344895211',
      enteredBy: 'Robert Leidl',
      entryDate: moment().add(3, 'hours').format(),
      timeIncident: '18:50 PM',
      hours: '18',
      minutes: '50',
      incidentDetails: [
        {
          askedToLeave: true,
          refuseService: false,
          maliciousDamage: false,
          minors: true,
          gaming: false,
          refuseEntry: false,
          theft: false,
          complaint: true,
          selfExclusion: true
        }
      ],
      incidentType: '',
      criticalIncidents: [
        {
          fileToQuit: false,
          brawl: false,
          glassing: false,
          antiSocial: false,
          injury: false,
          weapon: false,
          dogAttack: false,
          removeFirearm: true,
          discharge: false,
          serious: false
        }
      ],
      locationIncidents: [
        {
          barArea: false,
          mainBar: false,
          gamingRoom: true,
          smokingArea: false,
          frontDoor: false,
          offVenue: false
        }
      ],
      locationIncident: '',
      physicalDescription: [
        {
          appearance: 'Training',
          gender: 'Male',
          age: '26-34',
          clothingTop: 'T-shirt',
          clothingBottom: 'blue trousers',
          taxiOffered: false
        }
      ],
      documents: [],
      // description: 'Lorem ipsum',
      addedFiles: [],
      statusIncident: 'complete'
    },
    {
      id: '2',
      client: 'Selvador Kris',
      clientAddress: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
      reportedBy: 'Henry Fog',
      dateOfIncident: moment().format(),
      venueLicenceNumber: '55180344895211',
      enteredBy: 'Robert Leidl',
      entryDate: moment().add(3, 'hours').format(),
      timeIncident: '18:50 PM',
      hours: '18',
      minutes: '50',
      incidentDetails: [
        {
          askedToLeave: true,
          refuseService: false,
          maliciousDamage: false,
          minors: true,
          gaming: false,
          refuseEntry: false,
          theft: false,
          complaint: true,
          selfExclusion: true
        }
      ],
      incidentType: '',
      criticalIncidents: [
        {
          fileToQuit: false,
          brawl: false,
          glassing: false,
          antiSocial: false,
          injury: false,
          weapon: false,
          dogAttack: false,
          removeFirearm: true,
          discharge: false,
          serious: false
        }
      ],
      locationIncidents: [
        {
          barArea: false,
          mainBar: false,
          gamingRoom: true,
          smokingArea: false,
          frontDoor: false,
          offVenue: false
        }
      ],
      locationIncident: '',
      physicalDescription: [
        {
          appearance: 'Training',
          gender: 'Male',
          age: '26-34',
          clothingTop: 'T-shirt',
          clothingBottom: 'blue trousers',
          taxiOffered: false
        }
      ],
      documents: [
        {
          description: 'Lorem ipsum'
        }
      ],
      addedFiles: [],
      statusIncident: 'complete'
    }
  ];
}
