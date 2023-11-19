export class ResourcesFakeDb {
  public static resources = [
    {
      id: '123456',
      user_id: '123456',
      name: 'Trevino Marvel',
      email: 'trevino@gmail.com',
      detail: {
        avatar: 'https://picsum.photos/100?random=7',
        address: '15 Debenham St, Mawson, ACT',
        tfn: '4534563456',
        mobile: '1231123121'
      },
      charge_rate: 25,
      totalHours: '123',
      rating: 4,
      status: 1,
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
              accreditation: 'NSW Liquor Licence',
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
      id: '4321432143214321',
      user_id: '4321432143214321',
      name: 'Trevino Marvel2',
      email: 'trevino2@gmail.com',
      detail: {
        mobile: '12311231212',
        address: '15 Debenham St, Mawson, ACT'
      },
      totalHours: '321',
      rating: 3,
      status: 2,
      charge_rate: 15,
      documents: [],
      accreditation: [
        {
          id: 'grt34354rtgr43',
          type: 'Security Licence',
          accreditation: 'WA Security Number',
          licenceNumber: '5532234523',
          class: '',
          expiryDate: '09/06/2023',
          file: ''
        }
      ],
      contacts: []
    }
  ];

  public static venueResourceRequirements = [
    {
      uuid: 'yt6756rtr545er3456765erfgf',
      name: 'Tyson Cherry',
      chargePlan: 'Discount',
      chargeRates: '20$/h',
      avatar: 'https://picsum.photos/100?random=8'
    },
    {
      uuid: 'y5443256rw22454',
      name: 'Trevino Marvel',
      chargePlan: 'Standart',
      chargeRates: '30$/h',
      avatar: 'https://picsum.photos/100?random=7'
    }
  ];

  public static controlsForNSWSecurityLicence = [
    'licenceNumber',
    'expiresAt',
    'type',
    'licenceStatus',
    'accreditationNumberOfServiceAlcohol',
    'expiresAt2',
    'classAServiceOfAlcohol',
    'classGServiceOfAlcohol',
    'classHServiceOfAlcohol',
    'classPServiceOfAlcohol',
    'typeNSWServiceOfAlcohol'
  ];
  public static controlsForNSWResponsibleServiceOfAlcohol = [
    'licenceNumberOfNSWAlcohol',
    'expiresAtNSWAlcohol',
    'classA',
    'classG',
    'classH',
    'classP',
    'typeLicence',
    'typeNSWSecurityLicenceOfAlcoholBottom',
    'accreditationStatusSecurityLicenceOfAlcoholBottom',
    'accreditationNumberOfSecurityLicenceBottom',
    'startAtSecurityLicenceBottom',
    'expiresAtSecurityLicenceBottom',
    'class1ASecurityLicenceBottom',
    'class1BSecurityLicenceBottom',
    'class1CSecurityLicenceBottom',
    'class1DSecurityLicenceBottom',
    'class1ESecurityLicenceBottom',
    'class1FSecurityLicenceBottom',
    'class1GSecurityLicenceBottom',
    'class2ASecurityLicenceBottom',
    'class2BSecurityLicenceBottom',
    'class2CSecurityLicenceBottom',
    'class2DSecurityLicenceBottom',
    'classMASecurityLicenceBottom',
    'classMBSecurityLicenceBottom',
    'classMCSecurityLicenceBottom',
    'classMDSecurityLicenceBottom',
    'classMESecurityLicenceBottom'
  ];
  public static controlsForVIKSecurityLicence = [
    'licenceNumber',
    'expiresAtSecurityLicenceVICBottom',
    'typeVICSecurityLicenceBottom',
    'accreditationStatusSecurityLicenceVICBottom',
    'expiresAtSecurityLicenceOfAlcoholVICBottom',
    'expiresAt3',
    'type2'
  ];
  public static controlsForVICResponsibleServiceOfAlcohol = [
    'expiresAtVICAlcohol',
    'typeVICResponsibleServiceOfAlcohol',
    'accreditationStatusVICResponsibleServiceOfAlcohol',
    'accreditationNumberOfSecurityLicenceVIC',
    'expiresAtSecurityLicenceVIC',
    'crowdControllerSecurityLicenceVIC',
    'securityGuardSecurityLicenceVIC',
    'privateSecurityTrainerSecurityLicenceVIC',
    'bodyguardSecurityLicenceVIC',
    'investigatorSecurityLicenceVIC',
    'typeSecurityLicenceVIC',
    'expiresAtVICResponsibleServiceOfGaming',
    'typeVICResponsibleServiceOfGaming'
  ];
  public static controlsForQLDSecurityLicence = [
    'licenceNumber',
    'expiresAtQLDSecurityLicence',
    'typeQLDSecurityLicenceSecurityOperations',
    'accreditationStatusQLDSecurityLicenceSecurityOperations',
    'accreditationStatusQLDResponsibleServiceOfAlcohol',
    'expiresAtQLDResponsibleServiceOfGambling'
  ];
  public static controlsForQLDResponsibleServiceOfAlcohol = [
    'status',
    'typeQLDResponsibleServiceSecurityOperations',
    'accreditationStatusQLDResponsibleServiceSecurityOperations',
    'accreditationNumberOfSecurityLicenceQLD',
    'expiresAtSecurityLicenceQLD',
    'crowdControllerSecurityLicenceQLD',
    'privateInvestigatorSecurityLicenceQLD',
    'bodyguardSecurityLicenceQLD',
    'unarmedSecurityLicenceQLD',
    'cashInTransitSecurityLicenceQLD',
    'monitoringSecurityLicenceQLD',
    'dogPatrolSecurityLicenceQLD',
    'securityAdvisorSecurityLicenceQLD',
    'equipmentInstallerSecurityLicenceQLD',
    'firmClass1SecurityLicenceQLD',
    'firmClass2SecurityLicenceQLD',
    'expiresAtOfResponsibleServiceOfGamblingQLD'
  ];
  public static controlsForWASecurityLicence = [
    'licenceNumberWA',
    'expiresAtWASecurityLicence',
    'crowdControlAgent',
    'crowdController',
    'inquiryAgent',
    'investigator',
    'securityAgent',
    'securityBodyguard',
    'securityConsultant',
    'securityInstaller',
    'securityOfficer',
    'securityCompany',
    'expiresAtFirstAidWASecurityLicence',
    'typeWACertificateInSecurityOperations',
    'accreditationStatusWACertificateInSecurityOperations',
    'accreditationStatusWAResponsibleServiceOfAlcohol'
  ];
  public static controlsForWAResponsibleServOfAlcohol = [
    'typeWACertificateInSecurityOperationsResponsibleServiceOfAlcohol',
    'status',
    'accreditationStatusWACertificateInSecurityOperationsResponsibleServiceOfAlcohol',
    'accreditationNumberOfSecurityLicenceWA',
    'expiresAtWASecurityLicenceOfAlcohol',
    'crowdControlAgentWASecurityLicence',
    'crowdControllerWASecurityLicence',
    'inquiryAgentWASecurityLicence',
    'investigatorWASecurityLicence',
    'securityAgentWASecurityLicence',
    'securityBodyguardAgentWASecurityLicence',
    'securityConsultantWASecurityLicence',
    'securityInstallerWASecurityLicence',
    'securityOfficerWASecurityLicence',
    'securityCompanyWASecurityLicence'
  ];
}
