import * as moment from 'moment';

export class InterviewsAdmin {
  public static interviews = [
    {
      id: '3456436534645ygtgh',
      email: 'anna123@gmail.com',
      template: 'template',
      status: 'declined',
      updated: moment().format()
    },
    {
      id: 'rty4e56gtyw4e534',
      email: 'samara@gmail.com',
      template: 'template',
      status: 'declined',
      updated: moment().format()
    },
    {
      id: 'xfge54645yr54tygsr',
      email: 'frank123o@gmail.com',
      template: 'template',
      status: 'declined',
      updated: moment().format()
    },
    {
      id: 'xfge54645yr5234234',
      email: 'brandon123o@gmail.com',
      template: 'template',
      status: 'pending',
      updated: moment().format()
    },
    {
      id: '2342342342424324',
      email: 'carlos@gmail.com',
      template: 'Template 8',
      status: 'completed',
      updated: moment().format(),
      templateId: '34527349728349728383',
      answers: [
        'Carlos',
        'Python Developer Role',
        'Yes'
      ]
    },
    {
      id: '34645435354353',
      email: 'brass@gmail.com',
      template: 'Template 9',
      status: 'completed',
      updated: moment().format(),
      templateId: '34527349728349728383',
      answers: [
        'Brass',
        'Angular Developer Role',
        'Yes'
      ]
    },
    {
      id: '3423423424',
      email: 'boston@gmail.com',
      template: 'Template 10',
      status: 'completed',
      updated: moment().format(),
      templateId: '34527349728349728383',
      answers: [
        'Boston',
        'React Developer Role',
        'No'
      ]
    },
    {
      id: '2342322446424324',
      email: 'kalgoda@gmail.com',
      template: 'Template 5',
      status: 'completed',
      updated: moment().format(),
      templateId: '34527349728349728383',
      answers: [
        'Carlos',
        'Python Developer Role',
        'Yes'
      ]
    },
    {
      id: '3464dfsdfssss',
      email: 'adam@gmail.com',
      template: 'Template 6',
      status: 'completed',
      updated: moment().format(),
      templateId: '34527349728349728383',
      answers: [
        'Brass',
        'Angular Developer Role',
        'Yes'
      ]
    },
    {
      id: '23424fg3423424222424',
      email: 'bongo@gmail.com',
      template: 'Template 7',
      status: 'completed',
      updated: moment().format(),
      templateId: '34527349728349728383',
      answers: [
        'Boston',
        'React Developer Role',
        'No'
      ]
    }
  ];

  public static templates = [
    {
      id: '5trefgq34fewaaa',
      name: 'Template 1',
      createdBy: 'Nick',
      date: moment().format(),
      questions: []
    },
    {
      id: 'gdrt67u54fdrrew43',
      name: 'Template 2',
      createdBy: 'Robert',
      date: moment().format(),
      questions: []
    },
    {
      id: '657898ijhgj5653333',
      name: 'Template 3',
      createdBy: 'Anna',
      date: moment().format(),
      questions: []
    },
    {
      id: '34527349728349728383',
      name: 'Template 4',
      createdBy: 'Anna',
      date: moment().format(),
      questions: [
        {
          answerOption: 'Text',
          options: [],
          questionName: "What's your name?"
        },
        {
          answerOption: 'Text',
          options: [],
          questionName: 'What are you looking for the next role?'
        },
        {
          answerOption: 'Select',
          options: [
            {
              optionName: 'Yes'
            },
            {
              optionName: 'No'
            }
          ],
          questionName: 'Can you work Remotely?'
        }
      ]
    },
    {
      id: '23423423dfsf2342432',
      name: 'Template 5',
      createdBy: 'Nick',
      date: moment().format(),
      questions: []
    },
    {
      id: '3f3423fg3g33dfsdfgahhaha',
      name: 'Template 6',
      createdBy: 'Robert',
      date: moment().format(),
      questions: []
    },
    {
      id: 'dcbvbfbfdtrte2342422',
      name: 'Template 7',
      createdBy: 'Anna',
      date: moment().format(),
      questions: []
    }
  ];
}
