export class ConnectedVenuesFakeDb {
  public static venues = [
    {
      uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      client: {
        name: 'Robert\'s Super Security Firm Pty Ltd',
        uuid: '12341234134'
      },
      venue: {
        managers: [
          {
            address: '23 Norton Plaza, Leichardt, NSW, 2040',
            email: 'mike@gmail.com',
            name: 'Mike Miriston',
            phone: '+61437794659',
            uuid: '6273g2y3ye23egb2e'
          }
        ],
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
                data: "{\"template_uuid\":\"636086a9d9dbfb0537f92125\",\"type\":\"Identification\",\"name\":\"NSW Security Licence\",\"description\":\"Passport\",\"timing_requirement\":\"Before commence the Shift\",\"source\":\"https://www.example.com/licence.pdf\",\"selected\":true}",
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
            description: 'Guard description',
            item_code: '#123-321',
            name: 'Guard',
            resource_rate_id: 'd8e28207-ad9f-4620-906c-117ef0ed4938',
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
        ],
        uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      }
    }
  ];
}
