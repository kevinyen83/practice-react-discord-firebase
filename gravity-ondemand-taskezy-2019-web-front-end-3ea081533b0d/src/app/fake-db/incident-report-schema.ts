export class IncidentReportSchema {
  public static schema = {
    sections: [
      {
        id: 'acea788f-4625-48ba-8798-601783cf6647',
        defaultShow: true,
        name: 'Section A',
        fields: [
          {
            id: '70868e93-0add-4ce3-b209-66376b3e4fd2',
            label: 'Incident Details',
            relatedSection: null,
            type: 'multi-choice-checkbox',
            choices: [
              {
                id: '4cb1b8bb-763b-4ca4-ba56-ca8a4401c85d',
                label: 'Asked To Leave',
                relatedSection: null,
                type: 'checkbox',
                expand: true,
                expandFields: [
                  {
                    id: '87e99bae-3b49-4687-8539-64f9a5394502',
                    label: 'Asked To Leave - Reason',
                    relatedSection: null,
                    type: 'single-choice-string',
                    choices: [
                      'Approaching Intoxication',
                      'Suspected Intoxication',
                      'Violent',
                      'Illicit Substances',
                      'Insufficient ID',
                      'Minor',
                      'Smoking in Non-Smoking Area'
                    ]
                  }
                ]
              },
              {
                id: 'ce8c6c9a-82d3-4110-9f07-fc0f826dd39f',
                label: 'Refuse Entry',
                relatedSection: null,
                type: 'checkbox',
                expand: true,
                expandFields: [
                  {
                    id: '2d88d8f2-f0df-40ca-a839-dec2602ce29a',
                    label: 'Refuse Entry - Reasons',
                    relatedSection: null,
                    type: 'multi-choice-string',
                    choices: [
                      'Insufficient ID',
                      'Minors',
                      'Suspected Intoxication',
                      'Dress Code'
                    ]
                  }
                ]
              },
              {
                id: 'db35a970-1132-4829-902d-0b7314d2d311',
                label: 'Refuse Service',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '5f067714-0849-48eb-8f5c-794360717b46',
                label: 'Theft',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '0335cee7-36eb-4222-9810-1ad786ba74b6',
                label: 'Malicious Damage',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '00426347-d651-46b5-9040-d9e0d72efe3a',
                label: 'Complaint',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: 'f0797645-7ac8-40a8-a6b5-e42d8634e6ea',
                label: 'Minors',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: 'a1d41c47-82b5-4da9-8bab-a4a60f2f9d6f',
                label: 'Self Exclusion',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '85b2baf9-c610-4a70-8b57-7563d297857d',
                label: 'Gaming',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '7479d875-4872-4178-a45a-c4274784fe5c',
                label: 'Other (Please Specify',
                relatedSection: null,
                type: 'checkbox',
                expand: true,
                expandFields: [
                  {
                    id: '95aa018b-ae2c-44f1-9110-2a0188efe897',
                    label: 'Incident Type (Other)',
                    relatedSection: null,
                    type: 'text'
                  }
                ]
              },
              {
                id: '15e1b57e-bfcb-4580-815c-35677c465fa1',
                label: 'Asked to Leave - Fail to Quit',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: 'b914d33d-832e-4024-9264-0d8f2275ccd8',
                label: 'Violence - Brawl/Affray',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: 'b945f102-7dcf-4b8e-8edd-ef5fb1f0cb91',
                label: 'Violence - Glassing',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: '064f0493-ebf8-4931-9dea-087505dac263',
                label: 'Anti-social Behaviour',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: '0b1f8060-1272-47ff-85a8-4d9af97fe2ad',
                label: 'Injury / Medical Assistance',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: 'f6da65e3-cb36-491b-9320-ec7e1f0a59ee',
                label: 'Weapon',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: '4a68d320-886f-4d68-8e8f-b7af7de19a16',
                label: 'Dog Attack',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: 'e61c70f2-6fda-4de3-ba6e-d6a39abc9a17',
                label: 'Remove Firearm from Holster',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: '9ec8bd73-773f-4b11-8bbc-ded1f9f68af4',
                label: 'Discharge Firearm',
                relatedSection: 'Section B',
                type: 'checkbox'
              },
              {
                id: '95e68613-44dc-4684-b4ea-f9f0f1463005',
                label: 'Serious Other (Please Specify)',
                relatedSection: 'Section B',
                type: 'checkbox',
                expand: true,
                expandFields: [
                  {
                    id: '11d4d28f-d2db-43ea-aae5-f2142e1e4906',
                    label: 'Incident Type (Serious Other)',
                    relatedSection: 'Section B',
                    type: 'text'
                  }
                ]
              }
            ]
          },
          {
            id: '1969a7a7-7a41-4f38-a749-78bd379e043a',
            label: 'Location of Incident',
            relatedSection: null,
            type: 'multi-choice-checkbox',
            choices: [
              {
                id: '9fb63b60-7791-4c29-b41a-1de4a293d9ac',
                label: 'Bar Area',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '4f6a0ccc-d267-46eb-9c87-966236dd0271',
                label: 'Main Bar',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '6a832513-c521-4a86-9810-60551617f283',
                label: 'Gaming Room',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: 'bee8b888-fb0a-4f4d-882e-cb02a422e6df',
                label: 'Smoking Area',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: 'cf6afede-d826-4102-8a8f-923a110ba9f1',
                label: 'Front Door',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '35628975-df46-40bd-9bd8-c039d65f432e',
                label: 'Off Venue (50m Within Venue)',
                relatedSection: null,
                type: 'checkbox'
              },
              {
                id: '9c684c81-c083-4441-b400-073cdb22bf60',
                label: 'Front Door',
                relatedSection: null,
                type: 'checkbox',
                expand: true,
                expandFields: [
                  {
                    id: '6b28275d-9fcd-4e37-9141-89cd3a4da6de',
                    label: 'Other (Please Specify)',
                    relatedSection: null,
                    type: 'text'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '3c85c815-10da-4d04-84c1-f0eb2e9b2aa1',
        defaultShow: true,
        name: 'Persons Involved',
        fields: [
          {
            repeatGroup: {
              id: '0f85a009-fa0a-4abb-9b7d-9dff1ebc7226',
              label: 'Persons of Interest',
              items: [
                {
                  id: 'eed3671c-eca0-4b01-825b-05cad9974c9a',
                  label: 'Physical of Interest',
                  fields: [
                    {
                      id: '3a372024-45c8-42ce-acb2-0bafb5e8d4e1',
                      label: 'Appearance',
                      relatedSection: null,
                      type: 'single-choice-string',
                      choices: [
                        'Aboriginal/Torres Strait Islander',
                        'African',
                        'Asian',
                        'Caucasian',
                        'Indian Sub Continental',
                        'Mediterranean/Middle Eastern',
                        'Pacific Islander',
                        'South American'
                      ]
                    },
                    {
                      id: '628a63cf-4ed6-4b14-b182-ead571d9d34a',
                      label: 'Clothing - Top',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: 'c9ab8f00-8f3b-4067-b8b1-2ad13ace42a2',
                      label: 'Clothing - Bottom',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: '98290506-d2bc-4ac8-9fc9-9140bebdbebd',
                      label: 'Age',
                      relatedSection: null,
                      type: 'single-choice-string',
                      choices: [
                        'Under 18',
                        '18-25',
                        '26-34',
                        '35+'
                      ]
                    },
                    {
                      id: 'a8d63bb8-ae48-4142-9d7c-19723504531d',
                      label: 'Gender',
                      relatedSection: null,
                      type: 'single-choice-string',
                      choices: [
                        'Male',
                        'Female',
                        'Other'
                      ]
                    },
                    {
                      id: 'b9bdfe0d-546f-49f1-859a-471fec96f671',
                      label: 'Taxi Offered?',
                      relatedSection: null,
                      type: 'checkbox'
                    },
                    {
                      id: 'd0666ef0-77a0-441b-a1c8-4e1732440f6a',
                      label: 'Name (if required)',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: 'ce03878f-d7ae-4886-ae1d-c6aba0391c4d',
                      label: 'Phone (if required)',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: '99c71065-fac9-440a-8f11-97c5fd8f2d97',
                      label: 'Other Details (if required)',
                      relatedSection: null,
                      type: 'text'
                    }
                  ]
                }
              ]
            }
          },
          {
            repeatGroup: {
              id: '7c3d5c26-de92-4464-b517-24a2d11b8917',
              label: 'Witness Details',
              items: [
                {
                  id: 'ecac3fa2-51e6-4d15-a1ee-524b393dfd44',
                  label: 'Witness',
                  fields: [
                    {
                      id: 'e0ca7402-0867-40b8-84d8-bdcffab349fe',
                      label: 'Name',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: '5bc326cb-34ee-4c8e-9fd4-3dcb3dd47ab2',
                      label: 'Phone',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: '645c6880-f065-4947-96fa-f12e7bcef96a',
                      label: 'Other Details',
                      relatedSection: null,
                      type: 'text'
                    }
                  ]
                }
              ]
            }
          },
          {
            repeatGroup: {
              id: 'f8459c45-e688-4e54-9577-f3b49f7b3e97',
              label: 'Witness Details',
              items: [
                {
                  id: '0be46c73-fb81-4dc5-9556-f4a6ae4d5915',
                  label: 'Witness',
                  fields: [
                    {
                      id: 'c2112d09-def2-4553-b7dc-86ab44e7e458',
                      label: 'Name',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: 'e103d2c4-fd16-4a31-b00f-b7cde9279ce7',
                      label: 'Phone',
                      relatedSection: null,
                      type: 'string'
                    },
                    {
                      id: '1e871684-9e48-479e-9b90-4e9bfe2bc285',
                      label: 'Other Details',
                      relatedSection: null,
                      type: 'text'
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: '8cad5919-8df9-4a82-b04c-6a2cbf908134',
        defaultShow: false,
        name: 'Section B',
        fields: [
          {
            id: '3874e79f-e0b0-4c16-85ad-0e9e4cfddb6a',
            label: 'Additional Incident Details (if required)',
            type: 'text'
          },
          {
            id: '5ee29b22-28b4-4b0c-88ff-d8c4f8bcbbe7',
            label: 'Action Taken / Incident Details',
            type: 'multi-choice-checkbox',
            choices: [
              {
                id: '59f7e523-5397-4652-8a47-6ee0710cb891',
                label: 'Patron Refused Entry',
                type: 'checkbox'
              },
              {
                id: '94f79a83-1921-4406-9116-57e693157429',
                label: 'Patron Refused Service',
                type: 'checkbox'
              },
              {
                id: 'ac3f087e-d650-48a0-bb68-91ce3d3b08f9',
                label: 'Patron Asked to Leave',
                type: 'checkbox'
              },
              {
                id: '36ecd01f-316d-472c-95f0-56c400c4cd42',
                label: 'First Aid Treatment Supplied',
                type: 'checkbox'
              },
              {
                id: '9ed16f52-706c-4ec1-9d55-7bc05dbe0e9c',
                label: 'Ambulance Attended',
                type: 'checkbox'
              },
              {
                id: 'fe2af06b-a3e1-4b4c-855b-6146ca4b27ae',
                label: 'Security Attended',
                type: 'checkbox'
              },
              {
                id: 'b3d465c5-96af-43ee-a9d3-840a83657acc',
                label: 'Police Called by Venue Staff',
                type: 'checkbox'
              },
              {
                id: '7712fdfe-45e1-42f9-9230-e9ca141d05b9',
                label: 'Police Involved',
                type: 'checkbox'
              },
              {
                id: '0e9cc853-71c1-42ae-80fd-0211f06b62fd',
                label: 'Fail to Quit Notice Issued',
                type: 'checkbox'
              },
              {
                id: '0311918d-673d-49fa-827e-9c8cba1c04b8',
                label: 'Crime Scene Preserved',
                type: 'checkbox'
              },
              {
                id: '5b8df958-0202-4acd-b034-b8efe0d6d6de',
                label: 'Police / OLGR Inspection',
                type: 'checkbox'
              }
            ]
          },
          {
            id: '9d0199a6-ac68-4921-84df-192ba8985e95',
            label: 'Action Taken / Incident Details',
            type: 'single-choice-string',
            choices: [
              '-',
              'Unknown',
              'Yes',
              'No'
            ]
          },
          {
            id: 'f9f1b924-e977-4063-b855-1f4c08d8174a',
            label: 'Incident Summary Report',
            type: 'text'
          },
          {
            id: 'aea4142c-6d2b-4d05-bd7d-f92696ccff11',
            label: 'Linked to any other incidents?',
            type: 'checkbox'
          }
        ]
      }
    ]
  };
}
