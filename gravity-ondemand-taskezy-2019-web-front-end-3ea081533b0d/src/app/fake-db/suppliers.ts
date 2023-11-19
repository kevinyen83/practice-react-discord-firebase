export class SuppliersFakeDb {
  public static suppliers = [
    {
      id: 90909088888,
      uuid: '90909088888',
      detail: {
        avatar: 'https://picsum.photos/100?random=10',
        individual: false,
        primaryindustry: 'Security',
        abn: '90909088888',
        acn: '2378273982798789',
        name: 'Ketty Marvel',
        status: 'Active',
        complianceStatus: 'Compliant',
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phoneNumber: '92352424',
        contactEmail: 'ketty@gmail.com',
        emails: [
          {
            type: 'home',
            number: 'ketty@gmail.com'
          }
        ]
      },
      invitation: {
        date_invited: '0001-01-01T00:00:00Z',
        date_resolved: '0001-01-01T00:00:00Z',
        email: '',
        invite_name: '',
        invitee_id: '',
        primary_account_detail: { industry: '', name: '', phone: '', primary_address: '', postal_address: '' },
        primary_account_id: '',
        sender: { user_id: '', email: '', mobile: '', department: '', role: 0 },
        sms: '',
        status: 0,
        sub_account_detail: { industry: '', name: '', phone: '', primary_address: '', postal_address: '' },
        sub_account_id: '',
        sub_account_type: '',
        uuid: 'tr566rtfr6tyyu'
      },
      addresses: [
        {
          name: 'Address Dev',
          type: 'HQ',
          address: '15 Debenham St, Mawson, ACT',
          primary: true,
          postal: false,
          locations: [
            {
              name: 'Bedroom'
            }
          ],
          geolocation: {
            type: 'Point',
            coordinates: [
              0,
              0
            ]
          }
        }
      ],
      documents: [],
      connection_status: 0,
      accreditation: [
        {
          uuid: '09506064-06f8-42b3-919f-867207b1bfa0',
          category: 'Security Licence',
          accreditation: 'NSW Security Licence',
          number: '410459957',
          startdate: '2010-10-10',
          enddate: '2020-11-11',
          primary: true,
          updated: '2020-12-12:10:00:00Z',
          pinged: '2020-12-12:10:00:00Z',
          type: 'certificate',
          status: 'Expired',
          classes: [
            {
              code: '',
              name: 'Unarmed Guard'
            }
          ],
          documents: [
            {
              type: 'Accreditation',
              accreditation: 'NSW Security',
              title: 'Security document.',
              description: 'Some description',
              private: true,
              primary: true,
              location: '/usr/whatever'
            }
          ]
        }
      ],
      contacts: []
    },
    {
      id: '789078',
      uuid: '789078',
      detail: {
        avatar: 'https://picsum.photos/100?random=9',
        individual: false,
        primaryindustry: 'Security',
        abn: '345678987',
        acn: '3454566663322',
        name: 'Jack Allon',
        complianceStatus: 'Compliant',
        status: 'pending',
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phoneNumber: '0864321',
        contactEmail: 'jack@gmail.com',
        emails: [
          {
            type: 'home',
            number: 'jack@gmail.com'
          }
        ]
      },
      invitation: {
        date_invited: '0001-01-01T00:00:00Z',
        date_resolved: '0001-01-01T00:00:00Z',
        email: '',
        invite_name: '',
        invitee_id: '',
        primary_account_detail: { industry: '', name: '', phone: '', primary_address: '', postal_address: '' },
        primary_account_id: '',
        sender: { user_id: '', email: '', mobile: '', department: '', role: 0 },
        sms: '',
        status: 0,
        sub_account_detail: { industry: '', name: '', phone: '', primary_address: '', postal_address: '' },
        sub_account_id: '',
        sub_account_type: '',
        uuid: 'tr566rtfr6tyyu'
      },
      addresses: [
        {
          name: 'Address 1',
          type: 'HQ',
          address: '15 Debenham St, Mawson, ACT',
          primary: true,
          postal: false,
          locations: [
            {
              name: 'Bedroom'
            }
          ],
          geolocation: {
            type: 'Point',
            coordinates: [
              0,
              0
            ]
          }
        }
      ],
      connection_status: 0,
      documents: [],
      accreditation: [],
      contacts: []
    }
  ];
}
