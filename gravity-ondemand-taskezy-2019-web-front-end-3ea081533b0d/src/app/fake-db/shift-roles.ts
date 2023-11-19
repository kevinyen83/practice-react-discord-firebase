export class ShiftRolesFakeDb {
  public static roles = [
    {
      uuid: '53g4h23ut2765782342yuuyt63',
      role: 'Guard',
      accreditation: '3',
      credentials: [
        {
          name: 'NSW Security Licence',
          type: 'NSW Responsible Service of Alcohol ',
          induction: 'Induction 1'
        }
      ],
      rates: [
        {
          name: 'Standard',
          value: '25',
          item_code: 'item_code #1'
        },
        {
          name: 'Premium',
          value: '35',
          item_code: 'item_code #4'
        },
        {
          name: 'Discount',
          value: '35',
          item_code: 'item_code #4'
        }
      ],
      chargeRate: 'Standart',
      itemCode: '#6-2010',
      description: ``,
      rate: '20$/h'
    },
    {
      uuid: 'h34gyu789032f3h627weh2346fd79h56s3',
      role: 'RSA Marshal',
      accreditation: '5',
      credentials: [
        {
          name: 'NSW Security Licence',
          type: 'NSW Responsible Service of Alcohol ',
          induction: 'Induction 1'
        }
      ],
      rates: [
        {
          name: 'Standard',
          value: '35',
          item_code: 'item_code #4'
        },
        {
          name: 'Premium',
          value: '20',
          item_code: 'item_code #2'
        },
        {
          name: 'Discount',
          value: '35',
          item_code: 'item_code #4'
        }
      ],
      chargeRate: 'Discount',
      itemCode: '#7-2010',
      description: ``,
      rate: '15$/h'
    },
    {
      uuid: '637gfw22342630654x34567i9ubb2_bgy37_hhhe',
      role: 'Marshal',
      accreditation: '2',
      credentials: [
        {
          name: 'NSW Security Licence',
          type: 'NSW Responsible Service of Alcohol ',
          induction: 'Induction 1'
        }
      ],
      rates: [
        {
          name: 'Standard',
          value: '35',
          item_code: 'item_code #4'
        },
        {
          name: 'Premium',
          value: '35',
          item_code: 'item_code #4'
        },
        {
          name: 'Discount',
          value: '45',
          item_code: 'item_code #3'
        }
      ],
      chargeRate: 'Premium',
      itemCode: '#8-2010',
      description: ``,
      rate: '30$/h'
    },
    {
      uuid: 'ngftujsd_nhusio947672_663hysd67238_45672994',
      role: 'Supervising Resource',
      accreditation: '6',
      credentials: [
        {
          name: 'NSW Security Licence',
          type: 'NSW Responsible Service of Alcohol ',
          induction: 'Induction 1'
        }
      ],
      rates: [
        {
          name: 'Standard',
          value: '35',
          item_code: 'item_code #4'
        },
        {
          name: 'Premium',
          value: '35',
          item_code: 'item_code #4'
        },
        {
          name: 'Discount',
          value: '35',
          item_code: 'item_code #4'
        }
      ],
      chargeRate: 'Standart',
      itemCode: '#9-2010',
      description: ``,
      rate: '20$/h'
    }
  ];
}
