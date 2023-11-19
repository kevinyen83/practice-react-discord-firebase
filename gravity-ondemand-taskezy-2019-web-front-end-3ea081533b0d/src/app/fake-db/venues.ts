import { ComplianceAndOperationsFakeDb } from './complianceAndOperations';
import { InductionRequirementsFakeDb } from './inductionRequirements';
import { CriteriaRatesFakeDb } from './criteriaRates';
import { VenueResourcesFakeDb } from './venueResources';
import { ResourcesHistoryFakeDb } from './resourcesHistory';
import { ResourceWorkDataFakeDb } from './resourceWorkData';
import { IncidentHistoryFakeDb } from './incidentHistory';

export class VenuesFakeDb {
  public static venues = [
    // {
    //   uuid : '745frd564654',
    //   name: 'Opera Bar',
    //   client: 'Selvador Kris',
    //   address: 'Friedrichstraße, Berlin, Germany',
    //   status: 'Active',
    //   operations : ComplianceAndOperationsFakeDb.operations,
    //   requirements: InductionRequirementsFakeDb.requirements,
    //   rates: CriteriaRatesFakeDb.rates,
    //   resources: VenueResourcesFakeDb.resources,
    //   resourcesHistory: ResourcesHistoryFakeDb.history,
    //   resourceWorkData: ResourceWorkDataFakeDb.workData,
    //   incidentHistory: IncidentHistoryFakeDb.histories
    // },
    // {
    //   uuid : '8756rtgrde4353435r34r',
    //   name: 'Irish Pub',
    //   client: 'Irish Pub',
    //   address: 'Friedrichstraße, Berlin, Germany',
    //   status: 'Pending',
    //   operations : ComplianceAndOperationsFakeDb.operations,
    //   requirements: InductionRequirementsFakeDb.requirements,
    //   rates: CriteriaRatesFakeDb.rates,
    //   resources: VenueResourcesFakeDb.resources,
    //   resourcesHistory: ResourcesHistoryFakeDb.history,
    //   resourceWorkData: ResourceWorkDataFakeDb.workData,
    //   incidentHistory: IncidentHistoryFakeDb.histories
    // },
    // {
    //   uuid: 'j525gyruejaeyui34r38932oejdjh',
    //   name: 'Opera Pub',
    //   client: 'Selvador Kris'
    // }
    {
      accreditation_requirements: [
        {
          description: 'This is the licence description',
          name: 'NSW Security Licence',
          source: 'https://www.example.com/licence.pdf',
          template_uuid: '123456789',
          timing_requirement: 'Before Shift Start',
          type: 'Security'
        }
      ],
      address: {
        geo_location: {
          coordinates: [0],
          type: 'string'
        },
        'google-call': 'string',
        'google-place-id': 'string',
        street_location: '23 Norton Plaza, Leichardt, NSW, 2040'
      },
      comment: 'string',
      contract_review_date: '2023-01-01',
      contract_start_date: '2019-01-01',
      contract_term: '2 Years',
      documents: [
        {
          date_added: 'string',
          date_modified: 'string',
          description: 'string',
          name: 'string',
          private: true,
          tag: 'string',
          uuid: 'string'
        }
      ],
      executing_parties: 'John Smith, CEO Peter Holiday, Manager',
      licence_name: 'Licence Name',
      licence_number: '123456789',
      logo: 'https://www.example.com/logo.png',
      name: 'Venue Name',
      roles: [
        {
          credentials: [
            {
              data: "{\"template_uuid\":\"636086a9d9dbfb0537f92125\",\"type\":\"Identification\",\"name\":\"place accred finance\",\"description\":\"Passport\",\"timing_requirement\":\"Before commence the Shift\",\"source\":\"https://www.example.com/licence.pdf\",\"selected\":true}",
              roles: [0],
              tags: [
                '["tag1"',
                '"tag2"]'
              ],
              template: '1234-1234-1234',
              type: 'Induction',
              uuid: '1234-1234-1234'
            }
          ],
          resource_rate_id: 'd8e28207-ad9f-4620-906c-117ef0ed4938',
          description: 'Guard description',
          item_code: '#123-321',
          name: 'Guard',
          rates: [
            {
              item_code: '#123 456',
              name: 'Standard',
              value: 10
            }
          ],
          uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        }
      ],
      stations: [
        {
          name: 'string'
        }
      ],
      type: 'Private',
      uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      sign_on_distance: 100,
      resource_rates: [
        {
          description: "fgcc",
          name: "tfhtd",
          rates: [
            {
              item_code: "fgh",
              name: "Standard",
              value: 15
            },
            {
              item_code: "dfgvs",
              name: "Premium",
              value: 35
            },
            {
              item_code: "fesrf",
              name: "Discount",
              value: 45
            }
          ],
          uuid: "d8e28207-ad9f-4620-906c-117ef0ed4938"
        }
      ]
    }
  ];

  public static dataTables = {
    thsTableOperations: [
      'name',
      'description',
      'file',
      'category'
    ],
    thsTableRequirements: [
      'name',
      'description',
      'file'
    ],
    thsTableCriteria: [
      'category',
      'accreditation',
      'class',
      'quantity'
    ],
    thsTableResources: [
      'name',
      'supplier',
      'listing type'
    ],
    thsTableResourceHistory: [
      'resourceName',
      'date/time',
      'taskID',
      'class',
      'hourlyRate',
      'totalCost',
      'comments',
      'rating',
      'supplier',
      'listingType',
      'incidents'
    ],
    thsResourceWorkData: [
      'year',
      'all tasks',
      'accept',
      'decline',
      'pending',
      'rating'
    ],
    thsIncidentHistory: [
      'resource',
      'taskID',
      'date/time',
      'description',
      'status'
    ]
  };
}
