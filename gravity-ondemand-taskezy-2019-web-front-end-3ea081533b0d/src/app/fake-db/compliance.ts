export class ComplianceFakeDb {
  public static accreditations = [
    {
      id: '5e6ed43e38e3816c08d0b8e1',
      category: 'Security Licence',
      credentials: [
        {
          accreditation: 'NSW Security Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            // {
            //   label: 'Expires At',
            //   type: 'date',
            //   choices: null
            // },
            // {
            //   label: 'Class',
            //   type: 'multi-choice-string',
            //   choices: [
            //     'Unarmed Guard',
            //     'Bodyguard',
            //     'Crowd Controller',
            //     'Guard Dog Handler',
            //     'Monitoring Center Operator',
            //     'Armed Guard',
            //     'Security Consultant',
            //     'Security Seller',
            //     'Security Equipment Specialist',
            //     'Security Trainer',
            //     'Master Licencee: Self-employed & holds Class 1 or 2 licence or both and provides own service',
            //     'Master Licencee: Provides no more than 3 persons on any one day & holds Class 1 or 2 licence or both',
            //     'Master Licencee: Provides no more than 14 persons on any one day & holds Class 1 or 2 licence or both',
            //     'Master Licencee: Provides no more than 49 persons on any one day & holds Class 1 or 2 licence or both',
            //     'Master Licencee: Unlimited persons'
            //   ]
            // }
          ],
          validation: {
            api: 'security-nsw',
            outputs: [
              {
                label: 'Licence Number',
                type: 'label',
                map: 'licenceNumber'
              },
              {
                label: 'Expires At',
                type: 'label',
                map: 'expiryDate'
              },
              {
                label: 'Licensee',
                type: 'label',
                map: 'licensee'
              },
              {
                label: 'Classes',
                type: 'label',
                map: 'classes.description'
              },
              {
                label: 'Front',
                type: 'image'
              },
              {
                label: 'Back',
                type: 'image'
              }
            ],
            success: {
              key: 'status',
              value: 'Current'
            }
          }
        },
        {
          accreditation: 'VIC Security Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'QLD Security Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'WA Security Number',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'Crowd Control Agent',
                'Crowd Control',
                'Inquiry Agent',
                'Investigator',
                'Security Agent',
                'Security Bodyguard',
                'Security Consultant',
                'Security Installer',
                'Security Officer',
                'Security Company'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed46538e3816c08d0b8e2',
      category: 'RSA Licence',
      credentials: [
        {
          accreditation: 'NSW Responsible Service of Alcohol',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'Class A - Responsible Service of Alcohol',
                'Class G - Responsible Conduct of Gambling',
                'Class H - High Risk Venue Management',
                'Class P - Privacy Training'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Card',
                'Interim',
                'Certificate'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'VIC Responsible Service of Alcohol',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'QLD Responsible Service of Alcohol',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Licence Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'WA Responsible Service of Alcohol',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Licence Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed47738e3816c08d0b8e3',
      category: 'RSG Licence',
      credentials: [
        {
          accreditation: 'NSW Responsible Service of Alcohol',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'Class A - Responsible Service of Alcohol',
                'Class G - Responsible Conduct of Gambling',
                'Class H - High Risk Venue Management',
                'Class P - Privacy Training'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Card',
                'Interim',
                'Certificate'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'VIC Responsible Service of Gaming',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Module 1',
                'Module 2'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'QLD Responsible Service of Gambling',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed48b38e3816c08d0b8e4',
      category: 'RSA Privacy Licence',
      credentials: [
        {
          accreditation: 'NSW Responsible Service of Alcohol',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'Class A - Responsible Service of Alcohol',
                'Class G - Responsible Conduct of Gambling',
                'Class H - High Risk Venue Management',
                'Class P - Privacy Training'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Card',
                'Interim',
                'Certificate'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed4df38e3816c08d0b8e5',
      category: 'Liquor Licence',
      credentials: [
        {
          accreditation: 'NSW Liquor Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'VIC Liquor Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'QLD Liquor Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'WA Liquor Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Club',
                'Club Restricted',
                'Hotel',
                'Hotel Restricted',
                'Tavern',
                'Tavern Restricted',
                'Small Bar',
                'Casino Liquor Licence',
                'Special Facility',
                'Producer',
                'NightClub',
                'Occasional',
                'Restaurant',
                'Wholesaler',
                'Liquor Stores'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed4f538e3816c08d0b8e6',
      category: 'Driver Licence',
      credentials: [
        {
          accreditation: 'NSW Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'VIC Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'NT Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'SA Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'WA Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'ACT Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Qld Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Tas Driver Licence',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: "Int'l Driver Licence",
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'C - Car',
                'R - Rider',
                'HC - Heavy Combination',
                'HR - Heavy Rigid',
                'LR - Light Rigid',
                'MC - Multi Combination ',
                'MR - Medium Rigid'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Full',
                'Learners',
                'Provisional'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed73038e3816c08d0b8e8',
      category: 'Other Individual Accreditation',
      credentials: [
        {
          accreditation: 'Traffic Control',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Class',
              type: 'multi-choice-string',
              choices: [
                'Red - Select & modify traffic control plans',
                'Blue - Control traffic with a stop/slow bat',
                'Orange - Design & inspect traffic control plans',
                'Yellow - Implement traffic management plan'
              ]
            },
            {
              label: 'Type',
              type: 'single-choice-string',
              choices: [
                'Card',
                'Interim',
                'Certificate'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'General Construction Induction Card',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Starts At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Current',
                'Expired',
                'Cancelled',
                'Withdrawn',
                'Surrendered',
                'Suspended'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Royal Life Saving',
          inputs: [
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            },
            {
              label: 'Status',
              type: 'single-choice-string',
              choices: [
                'Australia Pool Lifeguard Certificate',
                'Australia Pool Lifeguard Licence',
                'Royal Life Saving Bronze Medallion',
                'Royal Life Saving Resuscitation'
              ]
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Fire Safety Officer',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'First Aid',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Public Liability Insurance ',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Work Cover',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Visa',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    },
    {
      id: '5e6ed74f38e3816c08d0b8e9',
      category: 'Other Organisation Accreditation',
      credentials: [
        {
          accreditation: 'Public Liability Insurance ',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        },
        {
          accreditation: 'Work Cover',
          inputs: [
            {
              label: 'Licence Number',
              type: 'string',
              choices: null
            },
            {
              label: 'Expires At',
              type: 'date',
              choices: null
            }
          ],
          validation: {
            api: '',
            outputs: [
              {
                label: 'Licence Number',
                type: 'string',
                choices: null
              },
              {
                label: 'Expires At',
                type: 'date',
                choices: null
              }
            ]
          }
        }
      ]
    }
  ];

  public static securityLicences = [
    {
      id: '410459957',
      address: '',
      businessNames: '',
      categories: '',
      classes: '',
      expiryDate: '23/04/2021',
      licenceID: '285-29NJ',
      licenceName: '',
      licenceNumber: '410459957',
      licenceType: 'Master Security Licence',
      licencee: 'FISHER SECURITY SERVICES PTY LTD',
      postcode: '',
      refusedDate: 'N/A',
      startDate: 'N/A',
      status: 'Current',
      suburb: '',
      vehicleRegistration: ''
    },
    {
      id: '345354312',
      address: '',
      businessNames: '',
      categories: '',
      classes: '',
      expiryDate: '23/04/2022',
      licenceID: '29NJ-582',
      licenceName: '',
      licenceNumber: '345354312',
      licenceType: 'Master Security Licence 2',
      licencee: 'FISHER SECURITY SERVICES PTY LTD 2',
      postcode: '',
      refusedDate: 'N/A',
      startDate: 'N/A',
      status: 'Current',
      suburb: '',
      vehicleRegistration: ''
    },
    {
      id: "411599644",
      categories: "",
      classes: [
        {
          className: "MA",
          description: "MA Self Employed Individual With No Other Provided Persons",
          endDate: "03/06/2026",
          isActive: true,
          startDate: "01/07/2022"
        }
      ],
      expiryDate: "03/06/2026",
      licenceName: "",
      licenceNumber: "411599644",
      licenceType: "Master Security Licence",
      licensee: "Andrew William Agnew",
      refusedDate: "",
      startDate: "01/07/2022",
      status: "Current"
    }
  ];

  public static abn = [
    {
      id: 74172177893,
      Abn: '74172177893',
      AbnStatus: 'Active',
      Acn: '',
      AddressDate: '2011-06-23',
      AddressPostcode: '2601',
      AddressState: 'ACT',
      BusinessName: ['Namadgi Entertainment'],
      EntityName: 'THE TRUSTEE FOR PSS FUND',
      EntityTypeCode: 'CSP',
      EntityTypeName: 'Commonwealth Government APRA Regulated Public Sector Scheme',
      Gst: '2000-07-01',
      Message: 'This could be anything coming from the Governement Registry'
    },
    {
      id: 99999999999,
      Abn: '99999999999',
      AbnStatus: 'Active',
      Acn: '',
      AddressDate: '2011-06-23',
      AddressPostcode: '2601',
      AddressState: 'ACT',
      BusinessName: ['99999999999 Namadgi Entertainment'],
      EntityName: 'THE TRUSTEE FOR PSS FUND',
      EntityTypeCode: 'CSP',
      EntityTypeName: 'Commonwealth Government APRA Regulated Public Sector Scheme',
      Gst: '2000-07-01',
      Message: 'This could be anything coming from the Governement Registry'
    },
    {
      id: 98746563111,
      Abn: '98746563111',
      AbnStatus: 'Active',
      Acn: '',
      AddressDate: '2011-06-23',
      AddressPostcode: '2601',
      AddressState: 'ACT',
      BusinessName: ['98746563111 Namadgi Entertainment'],
      EntityName: 'THE TRUSTEE FOR PSS FUND',
      EntityTypeCode: 'CSP',
      EntityTypeName: 'Commonwealth Government APRA Regulated Public Sector Scheme',
      Gst: '2000-07-01',
      Message: 'This could be anything coming from the Governement Registry'
    }
  ];

  public static acn = [
    {
      id: 741723987,
      Abn: '74172398771',
      AbnStatus: 'Active',
      Acn: '741723987',
      AddressDate: '2011-06-23',
      AddressPostcode: '2601',
      AddressState: 'ACT',
      BusinessName: ['Namadgi Entertainment 2'],
      EntityName: 'THE TRUSTEE FOR PSS FUND 2',
      EntityTypeCode: 'PRV',
      EntityTypeName: 'Australian Private Company',
      Gst: '2000-07-01',
      Message: 'This could be anything coming from the Governement Registry'
    }
  ];
}
