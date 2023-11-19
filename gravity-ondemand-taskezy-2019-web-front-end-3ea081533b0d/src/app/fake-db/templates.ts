export class TemplatesFakeDb {
  public static templates = [
    {
      uuid: '2342323532352',
      name: 'Assessment Template 1',
      description: 'Assessment Template 1 Description'
    },
    {
      uuid: '234223282392',
      name: 'Assessment Template 2',
      description: 'Assessment Template 2 Description'
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

  public static dataRegisterPage = {
    ["Australian driver's licence"]: [
      { control: 'state of issue', label: 'State of issue', type: 'input' },
      { control: 'licence number', label: 'Licence number', type: 'input' },
      { control: 'expiry date', label: 'Expiry date', type: 'date' }
      // {control: 'image of the dl', label: 'Image of the DL', type: 'input'},
      // {control: 'front and back', label: 'Front and Back', type: 'input'}
    ],
    ['Medicare card']: [
      { control: 'medicare number', label: 'Medicare number', type: 'input' },
      { control: 'individual card', label: 'Individual card reference number', type: 'input' },
      { control: 'name', label: 'Name as it appears on your card', type: 'input' },
      { control: 'card colour', label: 'Card colour', type: 'input' },
      { control: 'validate date', label: "Card's valid date", type: 'date' }
    ],
    ['Passport (all countries)']: [
      { control: 'country of issue', label: 'Country of issue', type: 'input' },
      { control: 'passport number', label: 'Passport number', type: 'input' },
      { control: 'expiry date', label: 'Expiry date', type: 'date' },
      { control: 'birth', label: 'Place of birth as stated on your passport', type: 'date' },
      { control: 'country', label: 'Country of birth', type: 'input' },
      { control: 'name', label: 'Family name at birth (Australian passports only)', type: 'input' },
      { control: '', label: 'Family name at citizenship (if you’re using an Australian passport but you were born overseas).', type: 'input' }
    ]
  };
  public static controlsOfModal = [
    {
      id: 'contacts',
      controls: [
        { name: 'name', type: 'input' },
        { name: 'email', type: 'input' },
        { name: 'phone', type: 'input' },
        { name: 'title', type: 'input' },
        { name: 'department', type: 'input' },
        { name: 'address', type: 'input' }
      ]
    },
    {
      id: 'sub-accounts',
      controls: [
        { name: 'type', type: 'input' },
        { name: 'abn', type: 'input' },
        { name: 'industry', type: 'select', items: [
            'Security',
            'Hospitality'
          ] },
        { name: 'phone', type: 'input' }
      ]
    }
  ];
}
