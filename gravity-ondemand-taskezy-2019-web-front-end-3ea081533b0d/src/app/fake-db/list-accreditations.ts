export class ListAccreditationsFakeDb {
  public static accreditations = [
    {
      name: 'Licence',
      types: [
        {
          type: 'Security',
          names: [
            'NSW Security Licence',
            'VIC Security Licence',
            'QLD Security Licence',
            'WA Security Number'
          ]
        },
        {
          type: 'RSA Licence',
          names: [
            'NSW Responsible Service of Alcohol',
            'VIC Responsible Service of Alcohol',
            'QLD Responsible Service of Alcohol',
            'WA Responsible Service of Alcohol'
          ]
        },
        {
          type: 'RCG Licence',
          names: [
            'NSW Responsible Conduct of Gambling',
            'VIC Responsible Service of Gaming',
            'QLD Responsible Service of Gambling'
          ]
        },
        {
          type: 'RSA Privacy Licence',
          names: ['NSW Responsible Service of Alcohol']
        },
        {
          type: 'Liquor',
          names: [
            'NSW Liquor Licence',
            'QLD Liquor Licence',
            'WA Liquor Licence'
          ]
        },
        {
          type: 'Other',
          names: ['Other']
        }
      ]
    },
    {
      name: 'Qualification',
      types: [
        {
          type: 'Degree/Certificate',
          names: [
            'Name of Degree/Certificate',
            'Issuing Institution',
            'Year of Completion',
            'Status or Level'
          ]
        },
        {
          type: 'Security Certificate',
          names: ['Certificate in Security Operations ']
        },
        {
          type: 'Courses',
          names: [
            'Name of Course',
            'Issuing Institution',
            'Year of Completion',
            'Status or Level'
          ]
        }
      ]
    },
    {
      name: 'Induction',
      types: [
        {
          type: 'Name of Client / Venue Location',
          names: ['Details']
        },
        {
          type: 'Training / Induction / Certificate',
          names: ['Description and issuer']
        }
      ]
    },
    {
      name: 'Vaccination',
      types: [
        {
          type: 'COVID-19',
          names: ['Medical Certificate']
        }
      ]
    },
    {
      name: 'Personal',
      types: [
        {
          type: 'Driver Licence',
          names: ['Driver Licence']
        },
        {
          type: 'Traffic Control',
          names: ['Traffic Control']
        },
        {
          type: 'Life Saving',
          names: ['Royal Life Saving']
        },
        {
          type: 'Construction Card',
          names: ['General Construction Induction Card ']
        },
        {
          type: 'Fire Safety',
          names: ['Fire Safety Officer ']
        },
        {
          type: 'First Aid',
          names: ['First Aid']
        },
        {
          type: 'Public Liability',
          names: ['Public Liability Insurance']
        },
        {
          type: 'Work Cover',
          names: [
            'Work Cover',
            'Expires At'
          ]
        },
        {
          type: 'Visa',
          names: [
            'Visa',
            'Expires At'
          ]
        }
      ]
    }
  ];
}
