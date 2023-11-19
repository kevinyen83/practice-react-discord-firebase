import { ResourcesFakeDb } from './resources';
import { SuppliersFakeDb } from './suppliers';
import { ClientsFakeDb } from './clients';
import { InvitationsFakeDb } from './invitations';
import { VenuesFakeDb } from './venues';
import { MembersFakeDb } from './members';
import { ExternalInvitationsFakeDb } from './external-invitations';

export class AccountsFakeDb {
  public static accounts = [
    {
      id: 12341234134,
      uuid: '12341234134',
      detail: {
        avatar: 'https://picsum.photos/100?random=2',
        individual: false,
        primaryindustry: 'Security',
        abn: '12341234134',
        acn: '2378273982798789',
        name: "Robert's Super Security Firm Pty Ltd",
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phone_numbers: [],
        emails: [
          {
            type: 'personal',
            number: 'darya@gmail.com'
          }
        ]
      },
      payment_instruments: [
        { valid: true }
      ],
      accountsCount: 0,
      primaryadmin: '',
      documents: [],
      accreditation: [],
      admins: [],
      externalInvites: {
        client_invitations: [],
        supplier_invitations: []
      },
      invitations: InvitationsFakeDb.invitations,
      clients: ClientsFakeDb.clients,
      members: MembersFakeDb.members,
      suppliers: SuppliersFakeDb.suppliers,
      resources: ResourcesFakeDb.resources,
      venues: VenuesFakeDb.venues
    },
    {
      id: 78907890789,
      uuid: '78907890789',
      detail: {
        avatar: 'https://picsum.photos/100?random=4',
        individual: false,
        primaryindustry: 'Security',
        abn: '78907890789',
        acn: '2378273982798789',
        name: 'Test 2',
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phone_numbers: [],
        emails: [
          {
            type: 'personal',
            number: 'darya@gmail.com'
          }
        ]
      },
      payment_instruments: [
        { valid: true }
      ],
      accountsCount: 1,
      documents: [],
      accreditation: [],
      externalInvites: {
        client_invitations: [],
        supplier_invitations: []
      },
      admins: [],
      primaryadmin: '',
      invitations: InvitationsFakeDb.invitations,
      clients: ClientsFakeDb.clients,
      members: MembersFakeDb.members,
      suppliers: SuppliersFakeDb.suppliers,
      resources: ResourcesFakeDb.resources,
      venues: VenuesFakeDb.venues
    },
    {
      id: 4321432143214321,
      uuid: '4321432143214321',
      detail: {
        avatar: '',
        individual: false,
        primaryindustry: '',
        abn: '',
        acn: '',
        name: '',
        tradingname: '',
        entitytype: '',
        phone_numbers: [],
        emails: [
          {
            type: 'personal',
            number: 'darya2@gmail.com'
          }
        ]
      },
      payment_instruments: [
        { valid: true }
      ],
      accountsCount: 2,
      externalInvites: {
        client_invitations: [],
        supplier_invitations: []
      },
      documents: [],
      accreditation: [],
      admins: [],
      primaryadmin: '',
      invitations: [],
      clients: [],
      suppliers: [],
      resources: [],
      venues: [],
      members: []
    },
    {
      id: 56464757411,
      uuid: '56464757411',
      detail: {
        avatar: 'https://picsum.photos/100?random=5',
        individual: false,
        primaryindustry: 'Security',
        abn: '56464757411',
        acn: '2378273982798789',
        name: 'Selvador Kris',
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phone_numbers: [
          {
            type: 'home',
            number: '1234098'
          }
        ],
        emails: [
          {
            type: 'home',
            number: 'darya3@gmail.com'
          }
        ]
      },
      payment_instruments: [
        { valid: true }
      ],
      accountsCount: 2,
      documents: [],
      externalInvites: {
        client_invitations: [],
        supplier_invitations: []
      },
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
      members: []
    },
    {
      id: 98746563111,
      uuid: '98746563111',
      detail: {
        avatar: 'https://picsum.photos/100?random=6',
        individual: false,
        primaryindustry: 'Security',
        abn: '98746563111',
        acn: '3454566663322',
        name: 'Great Man',
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phone_numbers: [
          {
            type: 'home',
            number: '0864321'
          }
        ],
        emails: [
          {
            type: 'home',
            number: 'darya4@gmail.com'
          }
        ]
      },
      payment_instruments: [
        { valid: true }
      ],
      accountsCount: 2,
      externalInvites: {
        client_invitations: [],
        supplier_invitations: []
      },
      venues: [],
      documents: [],
      accreditation: [],
      members: []
    },
    {
      id: 12345623232,
      uuid: '12345623232',
      detail: {
        avatar: 'https://picsum.photos/100?random=7',
        individual: false,
        primaryindustry: 'Security',
        abn: '12345623232',
        acn: '2378273982798789',
        name: 'Trevino Marvel',
        tradingname: 'Super Security',
        entitytype: 'Sole Trader',
        phone_numbers: [
          {
            type: 'home',
            number: '92352424'
          }
        ],
        emails: [
          {
            type: 'personal',
            number: 'darya5@gmail.com'
          }
        ]
      },
      venues: [
        {
          name: 'Address 2',
          type: 'HQ',
          address: '15 Debenham St, Mawson, ACT',
          primary: true,
          postal: false,
          locations: [
            {
              name: 'Bedroom'
            }
          ]
        }
      ],
      payment_instruments: [
        { valid: true }
      ],
      accountsCount: 0,
      externalInvites: ExternalInvitationsFakeDb.externalInvites,
      documents: [],
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
      members: []
    },
    {
      id: 74172177893,
      detail: {
        abn: '74172177893'
      },
      members: []
    }
  ];

  public static formData = [
    {
      created_by: "1234-1234-1234",
      creation_date_time: "2022-24-12T12:25:00Z",
      data: [
        { Key: 'expiry_date', Value: '2022-10-30T22:00:00.000Z' },
        { Key: 'issued_by', Value: 'dfcwef' },
        { Key: 'number', Value: '2' }
      ],
      modifications: [
        {
          modified_by: "",
          modified_date_time: ""
        }
      ],
      roles: [
        0
      ],
      tags: [
        "{\"lastModified\":1665517567471,\"lastModifiedDate\":\"2022-10-11T19:46:07.471Z\",\"name\":" +
        "\"Снимок экрана 2022-10-11 в 22.42.06.png\",\"size\":135117,\"type\":\"image/png\"}"
      ],
      template: "1234-1234-1234",
      type: "Induction",
      uuid: "drgserth5345fae43d4d5y6"
    }
  ]
}
