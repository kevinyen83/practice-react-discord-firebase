import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  markReadNotifications = new Subject<any>();
  markUnreadNotifications = new Subject<any>();
  deletedNotifications = new Subject<any>();
  notifications = [];

  constructor(private http: HttpClient) {}

  getNotifications() {
    return this.http.get('/api/notifications').subscribe((res) => {
      this.notifications = res[0].data;
    });
  }

  updateNotifications(notifications): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('/api/notifications', {
        id: 'notifications',
        data: [...notifications]
      }).subscribe((res) => {
        this.getNotifications();
      });
    });
  }
}
