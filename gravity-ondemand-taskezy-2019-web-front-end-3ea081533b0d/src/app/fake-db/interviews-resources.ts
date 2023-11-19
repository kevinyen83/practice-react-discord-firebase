import * as moment from 'moment';

export class InterviewsResourcesFakeDb {
  public static interviews = [
    {
      id: 'rt5ertrgrgse',
      template: 'Template 1',
      name: 'Security Guard Questionnaire',
      status: 'Completed',
      email: 'even@gmail.com',
      description: 'Invitation for interview. I need you to complete this interview form for us. Thanks!',
      updated: moment().format()
    }
  ];
}
