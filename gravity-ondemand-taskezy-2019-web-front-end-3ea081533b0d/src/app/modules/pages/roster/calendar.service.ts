import { Injectable } from '@angular/core';
const ics = require('ics');

@Injectable()

export class CalendarService {
  constructor() {}

  downloadEvent(taskDetail) {
    const taskDateTime = taskDetail.datetime.format('YYYY-M-DD-hh-mm').split('-');
    const event = {
      start: taskDateTime,
      duration: { hours: Math.floor(taskDetail.duration / 60), minutes: taskDetail.duration % 60 },
      title: `Task(Client: ${taskDetail?.client?.profile_name})`,
      description: '',
      location: taskDetail.address,
      url: '',
      geo: taskDetail?.geolocation?.coordinates ? {lat: taskDetail?.geolocation?.coordinates[1], lon: taskDetail?.geolocation?.coordinates[0]} : {},
      categories: ['Task'],
      status: this.handleStatus(taskDetail?.resource.status),
      busyStatus: 'BUSY',
      organizer: { name: taskDetail.client?.profile_name },
      attendees: [
        { name: taskDetail.resource?.profile_name },
        { name: taskDetail.supplier?.profile_name }
      ]
    };

    ics.createEvent(event, (error, value) => {
      if (error) {
        console.log(error);
        return ;
      }

      this.downloadIcs(value);
    });
  }

  downloadIcs(icsData: any) {
    const title = 'My Calendar';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(icsData));
    element.setAttribute('download', `${title}.ics`);
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    element.click();
  }

  handleStatus(status) {
    switch (status) {
      case 2:
        return 'CANCELLED';
      case 1:
        return 'CONFIRMED';
      case 0:
        return 'TENTATIVE';
      default:
        return 'TENTATIVE';
    }
  }
}
