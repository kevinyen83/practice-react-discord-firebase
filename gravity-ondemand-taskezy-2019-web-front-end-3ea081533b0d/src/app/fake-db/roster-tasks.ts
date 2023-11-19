import * as moment from 'moment';

export class RosterTasksFakeDb {
  public static tasks = [
    {
      id: '1289',
      uuid: '1289',
      account_uuid: '1289128912891289',
      release_status: 1,
      release_history: [
        {
          uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
          release_date: '2022-09-06T03:27:44.97Z',
          released_by_member: {
            uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
            email: 'nicholas.tsaoucis@gravityfusion.com',
            phone: '+61431700596'
          },
          release_status: 1,
          notifications: [],
          system_note: 'Shift released to client'
        }
      ],
      datetime: moment().add(2, 'days').format(),
      duration: 210,
      notes: [
        {
          author_id: '5edebhh5dfis8',
          author: 'Daria D',
          datetime: moment().format(),
          note: ''
        }
      ],
      changelog: [
        {
          avatar: '',
          date: moment('2021-06-10').format(),
          status: 'created',
          user: 'Selvador Kris'
        }
      ],
      venue: {
        uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Opera Pub',
        address: {
          street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
          geolocation: {
            type: 'Point',
            coordinates: [
              -105.7463,
              38.797222
            ]
          },
          'google-call': '',
          'google-place-id': ''
        },
        roles: [],
        stations: []
      },
      client_uuid: '98746563111',
      client_status: 0,
      shift_number: '',
      tasks: [
        {
          assessments: [],
          datetime: moment().add(2, 'days').format(),
          duration: 210,
          role: {
            uuid: 'e359bcee-26b4-45c2-b026-f917dd4d5672',
            name: 'Guard',
            item_code: '',
            description: 'guardy guard',
            rates: [
              {
                name: 'Standard',
                value: 12.5
              },
              {
                name: 'Premium',
                value: 25.5
              },
              {
                name: 'Discount',
                value: 45.5
              }
            ],
            credentials: []
          },
          supervisor: false,
          supplier: {
            uuid: '12341234134',
            name: 'Jack Allon',
            release_status: 1
          },
          resource: {
            uuid: '123456',
            name: 'Trevino Marvel',
            release_status: 0
          },
          notes: [
            {
              author_id: 'gf34567ytydf56y',
              author: 'Daria D',
              datetime: moment().format(),
              note: ''
            }
          ],
          timesheet: {
            breaks: [
              {
                datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
                duration: 3,
                geolocation: { type: '', coordinates: null },
                signature: '',
                userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
              }
            ],
            signoff: {
              datetime: moment().add(5, 'hours').format(),
              geolocation: { type: '', coordinates: null },
              signature:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
              userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            },
            signon: {
              datetime: moment().add(2, 'hours').format(),
              geolocation: { type: '', coordinates: null },
              signature:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
              userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            },
            result: 0,
            splits: [],
            additional_times: []
          }
        }
      ]
    },
    {
      id: '1234',
      uuid: '1234',
      account_uuid: '12341234134',
      release_status: 1,
      release_history: [
        {
          uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
          release_date: '2022-09-06T03:27:44.97Z',
          released_by_member: {
            uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
            email: 'nicholas.tsaoucis@gravityfusion.com',
            phone: '+61431700596'
          },
          release_status: 1,
          notifications: [],
          system_note: 'Shift released to client'
        }
      ],
      datetime: moment().subtract(10, 'minutes').format(),
      duration: 210,
      notes: [
        {
          author_id: '5edebhh5dfis8',
          author: 'Daria D',
          datetime: moment().format(),
          note: ''
        }
      ],
      changelog: [
        {
          avatar: '',
          date: moment('2021-06-11').format(),
          status: 'created',
          user: 'Selvador Kris'
        }
      ],
      venue: {
        uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Irish Pub',
        address: {
          street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
          geolocation: {
            type: 'Point',
            coordinates: [
              -105.7463,
              38.797222
            ]
          },
          'google-call': '',
          'google-place-id': ''
        },
        roles: [],
        stations: []
      },
      client_uuid: '98746563111',
      client_status: 0,
      shift_number: '',
      tasks: [
        {
          assessments: [],
          datetime: moment().subtract(10, 'minutes').format(),
          duration: 210,
          role: {
            uuid: 'e359bcee-26b4-45c2-b026-f917dd4d5672',
            name: 'Guard',
            item_code: '',
            description: 'guardy guard',
            rates: [
              {
                name: 'Standard',
                value: 12.5
              },
              {
                name: 'Premium',
                value: 25.5
              },
              {
                name: 'Discount',
                value: 45.5
              }
            ],
            credentials: []
          },
          supervisor: false,
          supplier: {
            uuid: '7890789078907890',
            name: 'Jack Allon',
            release_status: 1
          },
          resource: {
            uuid: '123456',
            name: 'Trevino Marvel',
            release_status: 0
          },
          notes: [
            {
              author_id: 'gf34567ytydf56y',
              author: 'Daria D',
              datetime: moment().format(),
              note: ''
            }
          ],
          timesheet: {
            breaks: [
              {
                datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
                duration: 3,
                geolocation: { type: '', coordinates: null },
                signature: '',
                userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
              }
            ],
            signoff: {
              datetime: moment().add(5, 'hours').format(),
              geolocation: { type: '', coordinates: null },
              signature:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
              userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            },
            signon: {
              datetime: moment().add(2, 'hours').format(),
              geolocation: { type: '', coordinates: null },
              signature:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
              userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            },
            result: 0,
            splits: [],
            additional_times: []
          }
        }
      ]
    },
    // {
    //   id: "3458753",
    //   uuid: "3458753",
    //   account_uuid: "1289128912891289",
    //   release_status: 1,
    // release_history: [
    //   {
    //     uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
    //     release_date: '2022-09-06T03:27:44.97Z',
    //     released_by_member: {
    //       uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
    //       email: 'nicholas.tsaoucis@gravityfusion.com',
    //       phone: '+61431700596'
    //     },
    //     release_status: 1,
    //     notifications: [],
    //     system_note: 'Shift released to client'
    //   }
    // ],
    //   datetime: moment().subtract(6, 'days').format(),
    //   duration: 210,
    //   notes: [
    //     {
    //       author_id: '5edebhh5dfis8',
    //       author: 'Daria D',
    //       datetime: moment().format(),
    //       note: ''
    //     }
    //   ],
    //   changelog: [
    //     {
    //       avatar: '',
    //       date: moment('2021-06-18').format(),
    //       status: 'created',
    //       user: 'Jack Allon'
    //     }
    //   ],
    //   venue: {
    //     name: 'Opera Bar',
    // address: {
    //   street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
    //   geolocation: {
    //     type: 'Point',
    //     coordinates: [-105.7463, 38.797222]
    //   },
    //   'google-call': "",
    //   'google-place-id': ""
    // },
    // roles: [],
    // stations: []
    //   },
    //   client_uuid: "345456",
    // shift_number: "",
    // tasks: [
    //   {
    //     assessments: [],
    //   datetime: moment().subtract(6, 'days').format(),
    //   duration: 210,
    //     role: {
    //       "uuid": "e359bcee-26b4-45c2-b026-f917dd4d5672",
    //       "name": "guard 2",
    //       "item_code": "",
    //       "description": "guardy guard",
    //       "rates": [
    //           {
    //               "name": "Standard",
    //               "value": 12.5
    //           },
    //           {
    //               "name": "Premium",
    //               "value": 25.5
    //           },
    //           {
    //               "name": "Discount",
    //               "value": 45.5
    //           }
    //       ],
    //       "credentials": []
    //   },
    //     supervisor: false,
    //     supplier: {
    //       uuid: '7890789078907890',
    //       name: 'Jack Allon',
    //       release_status: 1
    //     },
    //     resource: {
    //       uuid: '123456',
    //       name: 'Trevino Marvel',
    //       release_status: 0
    //     },
    //     timesheet: {
    //       breaks: [
    //         {
    //           datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
    //           duration: 3,
    //           geolocation: { type: '', coordinates: null },
    //           signature: '',
    //           userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //         }
    //       ],
    //       signoff: {
    //         datetime: moment().add(5, 'hours').format(),
    //         geolocation: { type: '', coordinates: null },
    //         signature:
    //           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
    //         userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //       },
    //       signon: {
    //         datetime: moment().add(2, 'hours').format(),
    //         geolocation: { type: '', coordinates: null },
    //         signature:
    //           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
    //         userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //       }
    //     }
    //   }
    // ]
    // },
    {
      id: '5678',
      uuid: '5678',
      account_uuid: '12341234134',
      release_status: 0,
      release_history: [
        {
          uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
          release_date: '2022-09-06T03:27:44.97Z',
          released_by_member: {
            uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
            email: 'nicholas.tsaoucis@gravityfusion.com',
            phone: '+61431700596'
          },
          release_status: 1,
          notifications: [],
          system_note: 'Shift released to client'
        }
      ],
      datetime: moment().add(1, 'days').format(),
      duration: 210,
      notes: [
        {
          author_id: '5edebhh5dfis8',
          author: 'Daria D',
          datetime: moment().format(),
          note: ''
        }
      ],
      changelog: [
        {
          avatar: '',
          date: moment('2021-06-18'),
          status: 'created',
          user: 'Selvador Kris'
        }
      ],
      venue: {
        uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Opera Bar',
        address: {
          street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
          geolocation: {
            type: 'Point',
            coordinates: [
              -105.7463,
              38.797222
            ]
          },
          'google-call': '',
          'google-place-id': ''
        },
        roles: [],
        stations: []
      },
      client_uuid: '56464757411',
      client_status: 0,
      shift_number: '',
      tasks: [
        {
          assessments: [],
          datetime: moment().add(1, 'days').format(),
          duration: 210,
          role: {
            uuid: 'e359bcee-26b4-45c2-b026-f917dd4d5672',
            name: 'Guard',
            item_code: '',
            description: 'guardy guard',
            rates: [
              {
                name: 'Standard',
                value: 12.5
              },
              {
                name: 'Premium',
                value: 25.5
              },
              {
                name: 'Discount',
                value: 45.5
              }
            ],
            credentials: []
          },
          supervisor: false,
          supplier: {
            uuid: '7890789078907890',
            name: 'Jack Allon',
            release_status: 1
          },
          resource: {
            uuid: '123456',
            name: 'Trevino Marvel',
            release_status: 0
          },
          notes: [
            {
              author_id: 'gf34567ytydf56y',
              author: 'Daria D',
              datetime: moment().format(),
              note: ''
            }
          ],
          timesheet: {
            breaks: [
              {
                datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
                duration: 3,
                geolocation: { type: '', coordinates: null },
                signature: '',
                userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
              }
            ],
            signoff: {
              datetime: moment().add(5, 'hours').format(),
              geolocation: { type: '', coordinates: null },
              signature:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
              userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            },
            signon: {
              datetime: moment().add(2, 'hours').format(),
              geolocation: { type: '', coordinates: null },
              signature:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
              userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            },
            result: 0,
            splits: [],
            additional_times: []
          }
        }
      ]
    },
    {
      id: '9101112',
      uuid: '9101112',
      account_uuid: '12341234134',
      release_status: 1,
      release_history: [
        {
          uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
          release_date: '2022-09-06T03:27:44.97Z',
          released_by_member: {
            uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
            email: 'nicholas.tsaoucis@gravityfusion.com',
            phone: '+61431700596'
          },
          release_status: 1,
          notifications: [],
          system_note: 'Shift released to client'
        }
      ],
      datetime: moment().add(1, 'days').format(),
      duration: 90,
      notes: [
        {
          author_id: '5edebhh5dfis8',
          author: 'Daria D',
          datetime: moment().format(),
          note: ''
        }
      ],
      changelog: [
        {
          avatar: '',
          date: moment('2021-01-08').format(),
          status: 'changed status',
          user: 'Selvador Kris'
        },
        {
          date: moment('2021-07-14').format(),
          status: 'created',
          user: 'Jack Allon'
        }
      ],
      venue: {
        uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'Irish Pub',
        address: {
          street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
          geolocation: {
            type: 'Point',
            coordinates: [
              -105.7463,
              38.797222
            ]
          },
          'google-call': '',
          'google-place-id': ''
        },
        roles: [],
        stations: []
      },
      client_uuid: '12341234134',
      client_status: 0,
      shift_number: '',
      tasks: [
        {
          assessments: [],
          datetime: moment().add(2, 'days').format(),
          duration: 90,
          role: {
            uuid: 'e359bcee-26b4-45c2-b026-f917dd4d5672',
            name: 'Guard',
            item_code: '',
            description: 'guardy guard',
            rates: [
              {
                name: 'Standard',
                value: 12.5
              },
              {
                name: 'Premium',
                value: 25.5
              },
              {
                name: 'Discount',
                value: 45.5
              }
            ],
            credentials: []
          },
          supervisor: false,
          supplier: {
            uuid: '7890789078907890',
            name: 'Jack Allon',
            release_status: 1
          },
          resource: {
            uuid: '123456',
            name: 'Trevino Marvel',
            release_status: 0
          },
          notes: [
            {
              author_id: 'gf34567ytydf56y',
              author: 'Daria D',
              datetime: moment().format(),
              note: ''
            }
          ],
          timesheet: {
            breaks: [
              // {
              //   datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
              //   duration: 3,
              //   geolocation: { type: '', coordinates: null },
              //   signature: '',
              //   userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
              // }
            ],
            result: 0,
            splits: [],
            additional_times: []
            // signoff: {
            //   datetime: moment().add(5, 'hours').format(),
            //   geolocation: { type: '', coordinates: null },
            //   signature:
            //     '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
            //   userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            // },
            // signon: {
            //   datetime: moment().add(2, 'hours').format(),
            //   geolocation: { type: '', coordinates: null },
            //   signature:
            //     '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
            //   userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
            // }
          }
        }
      ]
    }
    // {
    //   id: "12893",
    //   uuid: "12893",
    //   account_uuid: "1289128912891289",
    //   release_status: 0,
    // release_history: [],
    //   datetime: moment().add(2, 'weeks').format(),
    //   duration: 210,
    //   notes: [
    //     {
    //       author_id: '5edebhh5dfis8',
    //       author: 'Daria D',
    //       datetime: moment().format(),
    //       note: ''
    //     }
    //   ],
    //   changelog: [
    //     {
    //       avatar: '',
    //       date: moment('2021-06-10').format(),
    //       status: 'created',
    //       user: 'Selvador Kris'
    //     }
    //   ],
    //   venue: {
    //     name: 'Opera Pub',
    // address: {
    //   street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
    //   geolocation: {
    //     type: 'Point',
    //     coordinates: [-105.7463, 38.797222]
    //   },
    //   'google-call': "",
    //   'google-place-id': ""
    // },
    // roles: [],
    // stations: []
    //   },
    //   client_uuid: "345456",
    // shift_number: "",
    // tasks: [
    //   {
    //     assessments: [],
    //   datetime: moment().add(2, 'weeks').format(),
    //   duration: 210,
    //     role: {
    //       "uuid": "e359bcee-26b4-45c2-b026-f917dd4d5672",
    //       "name": "guard 2",
    //       "item_code": "",
    //       "description": "guardy guard",
    //       "rates": [
    //           {
    //               "name": "Standard",
    //               "value": 12.5
    //           },
    //           {
    //               "name": "Premium",
    //               "value": 25.5
    //           },
    //           {
    //               "name": "Discount",
    //               "value": 45.5
    //           }
    //       ],
    //       "credentials": []
    //   },
    //     supervisor: false,
    //     supplier: {
    //       uuid: '7890789078907890',
    //       name: 'Jack Allon',
    //       release_status: 1
    //     },
    //     resource: {
    //       uuid: '123456',
    //       name: 'Trevino Marvel',
    //       release_status: 0
    //     },
    //     timesheet: {
    //       breaks: [
    //         {
    //           datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
    //           duration: 3,
    //           geolocation: { type: '', coordinates: null },
    //           signature: '',
    //           userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //         }
    //       ],
    //       signoff: {
    //         datetime: moment().add(5, 'hours').format(),
    //         geolocation: { type: '', coordinates: null },
    //         signature:
    //           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
    //         userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //       },
    //       signon: {
    //         datetime: moment().add(2, 'hours').format(),
    //         geolocation: { type: '', coordinates: null },
    //         signature:
    //           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
    //         userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //       }
    //     }
    //   }
    // ]
    // },
    // {
    //   id: "12892",
    //   uuid: "12892",
    //   account_uuid: "1289128912891289",
    //   release_status: 1,
    // release_history: [
    //   {
    //     uuid: 'd949b1c8-cb2e-4623-b7d1-67e68a644da8',
    //     release_date: '2022-09-06T03:27:44.97Z',
    //     released_by_member: {
    //       uuid: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
    //       email: 'nicholas.tsaoucis@gravityfusion.com',
    //       phone: '+61431700596'
    //     },
    //     release_status: 1,
    //     notifications: [],
    //     system_note: 'Shift released to client'
    //   }
    // ],
    //   datetime: moment().subtract(2, 'weeks').format(),
    //   duration: 210,
    //   notes: [
    //     {
    //       author_id: '5edebhh5dfis8',
    //       author: 'Daria D',
    //       datetime: moment().format(),
    //       note: ''
    //     }
    //   ],
    //   changelog: [
    //     {
    //       avatar: '',
    //       date: moment('2021-06-10').format(),
    //       status: 'created',
    //       user: 'Selvador Kris'
    //     }
    //   ],
    //   venue: {
    //     name: 'Opera Bar',
    // address: {
    //   street_location: 'Rua Quinta dos Morgados YY, Barreiro e Lavradio, Portugal',
    //   geolocation: {
    //     type: 'Point',
    //     coordinates: [-105.7463, 38.797222]
    //   },
    //   'google-call': "",
    //   'google-place-id': ""
    // },
    // roles: [],
    // stations: []
    //   },
    //   client_uuid: "345456",
    // shift_number: "",
    // tasks: [
    //   {
    //     assessments: [],
    //   datetime: moment().subtract(2, 'weeks').format(),
    //   duration: 210,
    //     role: {
    //       "uuid": "e359bcee-26b4-45c2-b026-f917dd4d5672",
    //       "name": "guard 2",
    //       "item_code": "",
    //       "description": "guardy guard",
    //       "rates": [
    //           {
    //               "name": "Standard",
    //               "value": 12.5
    //           },
    //           {
    //               "name": "Premium",
    //               "value": 25.5
    //           },
    //           {
    //               "name": "Discount",
    //               "value": 45.5
    //           }
    //       ],
    //       "credentials": []
    //   },
    //     supervisor: false,
    //     supplier: {
    //       uuid: '7890789078907890',
    //       name: 'Jack Allon',
    //       release_status: 1
    //     },
    //     resource: {
    //       uuid: '123456',
    //       name: 'Trevino Marvel',
    //       release_status: 0
    //     },
    //     timesheet: {
    //       breaks: [
    //         {
    //           datetime: moment().set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).add(1, 'hours'),
    //           duration: 3,
    //           geolocation: { type: '', coordinates: null },
    //           signature: '',
    //           userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //         }
    //       ],
    //       signoff: {
    //         datetime: moment().add(5, 'hours').format(),
    //         geolocation: { type: '', coordinates: null },
    //         signature:
    //           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 80.000,109.000 C 116.028,97.120 116.500,100.000 153.000,91.000" stroke-width="6.955" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 153.000,91.000 C 212.398,76.701 188.528,85.120 225.000,85.000" stroke-width="4.286" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 225.000,85.000 C 212.279,105.493 232.898,90.201 194.000,118.000" stroke-width="5.913" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 194.000,118.000 C 160.452,128.984 174.279,131.493 149.000,137.000" stroke-width="4.890" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 149.000,137.000 C 156.510,139.459 145.452,139.484 164.000,139.000" stroke-width="6.954" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 164.000,139.000 C 180.923,135.447 181.010,137.959 198.000,134.000" stroke-width="5.769" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 198.000,134.000 C 210.500,134.000 210.423,132.947 223.000,134.000" stroke-width="7.199" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
    //         userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //       },
    //       signon: {
    //         datetime: moment().add(2, 'hours').format(),
    //         geolocation: { type: '', coordinates: null },
    //         signature:
    //           '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 125 80" width="125" height="80"><path d="M 105.000,127.000 C 110.166,125.354 109.500,124.500 114.000,122.000" stroke-width="8.020" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 114.000,122.000 C 119.300,109.413 122.166,114.854 129.000,106.000" stroke-width="6.698" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 129.000,106.000 C 148.476,103.521 146.300,99.913 168.000,103.000" stroke-width="5.452" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 168.000,103.000 C 192.139,96.701 185.976,102.521 204.000,104.000" stroke-width="5.296" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 204.000,104.000 C 212.056,117.678 211.639,108.701 207.000,127.000" stroke-width="6.567" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 207.000,127.000 C 190.633,146.363 196.056,147.178 172.000,163.000" stroke-width="4.999" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 172.000,163.000 C 161.283,169.703 162.633,171.363 151.000,177.000" stroke-width="5.648" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 151.000,177.000 C 143.521,179.957 145.783,180.703 141.000,185.000" stroke-width="6.631" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 141.000,185.000 C 138.600,193.031 139.021,188.957 142.000,195.000" stroke-width="7.228" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 142.000,195.000 C 150.991,195.830 148.100,198.531 160.000,196.000" stroke-width="6.788" stroke="black" fill="none" stroke-linecap="round"></path><path d="M 160.000,196.000 C 178.118,199.044 177.491,196.330 195.000,196.000" stroke-width="5.668" stroke="black" fill="none" stroke-linecap="round"></path></svg>',
    //         userId: 'c74c3a11-8399-413a-89d0-40492e8531e1'
    //       }
    //     }
    //   }
    // ]
    // }
  ];
}
