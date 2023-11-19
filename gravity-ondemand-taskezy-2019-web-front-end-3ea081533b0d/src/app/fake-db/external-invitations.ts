import * as moment from 'moment';

export class ExternalInvitationsFakeDb {
  public static externalInvites = {
    client_invitations: [
      {
        id: 5678,
        uuid: '5fc4c6fc-739a-4aab-8172-7f5f641ccdb8',
        sender: {
          user_id: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
          email: 'nicholas.tsaoucis@gravityfusion.com',
          mobile: '',
          department: '',
          role: 3,
          role_name: '',
          status: 0,
          status_date: '0001-01-01T00:00:00Z',
          name: ''
        },
        email: 'nicholas.tsaoucis+60@gravityfusion.com',
        sms: '',
        status: 0,
        date_invited: '2022-10-05T03:46:54.377Z',
        date_resolved: '0001-01-01T00:00:00Z',
        primary_account_id: '8614ef5c-a452-491f-ac61-9db55e6393ad',
        primary_account_detail: {
          industry: 'Hospitality',
          abn: '37814696382',
          name: 'TSAOUCIS, NICHOLAS JAMES',
          entitytype: 'Individual/Sole Trader',
          website: 'www.imawebsite.com.au',
          phone: '+61298761234',
          primary_address: '121 Pitt St, Sydney NSW 2000, Australia',
          postal_address: '121 Pitt St, Sydney NSW 2000, Australia'
        },
        sub_account_id: '92b4e2db-3a79-41d3-a5a5-3d4895424e4f',
        sub_account_detail: {
          industry: '',
          abn: '79139956343',
          name: 'The Trustee for ROBSON FAMILY TRUST',
          tradingname: 'MCDONALDS ARNDALE',
          entitytype: 'Discretionary Trading Trust',
          phone: '+61298761234',
          primary_address: '122 Pitt St, Sydney NSW 2000, Australia',
          postal_address: '122 Pitt St, Sydney NSW 2000, Australia'
        },
        sub_account_type: 'Supplier',
        invite_name: 'nick60',
        invitee_id: '',
        designCard: 'default'
      }
    ],
    supplier_invitations: [
      {
        id: 1234,
        uuid: 'a9addc45-d7e1-4fe2-92e7-b518a1ec970c',
        sender: {
          user_id: 'd5cda1f0-f8b0-48ab-89cb-08a85905a289',
          email: 'nicholas.tsaoucis@gravityfusion.com',
          mobile: '',
          department: '',
          role: 3,
          role_name: '',
          status: 0,
          status_date: '0001-01-01T00:00:00Z',
          name: ''
        },
        email: 'nicholas.tsaoucis+60@gravityfusion.com',
        sms: '',
        status: 0,
        date_invited: '2022-10-05T03:40:05.694Z',
        date_resolved: '0001-01-01T00:00:00Z',
        primary_account_id: '8614ef5c-a452-491f-ac61-9db55e6393ad',
        primary_account_detail: {
          industry: 'Hospitality',
          abn: '37814696382',
          name: 'TSAOUCIS, NICHOLAS JAMES',
          entitytype: 'Individual/Sole Trader',
          website: 'www.imawebsite.com.au',
          phone: '+61298761234',
          primary_address: '121 Pitt St, Sydney NSW 2000, Australia',
          postal_address: '121 Pitt St, Sydney NSW 2000, Australia'
        },
        sub_account_id: '078dbf55-e549-4ad1-962f-0a049318fcdd',
        sub_account_detail: {
          industry: '',
          abn: '79082260400',
          name: 'R G HALLIDAY PTY LTD',
          entitytype: 'Australian Private Company',
          phone: '+61298761234',
          primary_address: '122 Pitt St, Sydney NSW 2000, Australia',
          postal_address: '1322 Pitt St, Sydney NSW 2000, Australia'
        },
        sub_account_type: 'Supplier',
        invite_name: 'nick60',
        invitee_id: '',
        designCard: 'default'
      }
    ]
  };
}
