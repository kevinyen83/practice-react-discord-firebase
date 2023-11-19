import * as moment from 'moment';

export class planeOfUserFakeDb {
  public static plane = [
    {
      typeUser: 'Administrators',
      used: 1,
      remaining: 0
    },
    {
      typeUser: 'Sub-Accounts',
      used: 2,
      remaining: 3
    },
    {
      typeUser: 'Venues',
      used: 3,
      remaining: 5
    },
    {
      typeUser: 'Resources',
      used: 'Unlimited',
      remaining: 'Unlimited'
    }
  ];

  public static invoices = [
    {
      product: 'Business Tier One',
      reference: '12345678',
      date: moment(),
      price: '550$',
      status: 'ok'
    },
    {
      product: 'Business Tier One',
      reference: '12345678',
      date: moment(),
      price: '550$',
      status: 'ok'
    },
    {
      product: 'Business Tier One',
      reference: '12345678',
      date: moment(),
      price: '550$',
      status: 'ok'
    },
    {
      product: 'Business Tier One',
      reference: '12345678',
      date: moment(),
      price: '550$',
      status: 'ok'
    },
    {
      product: 'Business Tier One',
      reference: '12345678',
      date: moment(),
      price: '550$',
      status: 'ok'
    }
  ];
}
