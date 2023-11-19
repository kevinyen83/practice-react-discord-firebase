import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

import { fuseAnimations } from "@fuse/animations";
import { NotificationsService } from "../../../core/services/notifications/notifications.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NotificationsComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true, static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;

  notifications = [];
  viewIcons = false;
  selection;
  dataSource;
  displayedColumns: string[] = ["all"];

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.notificationsService.getNotifications();
    this.notifications = this.notificationsService.notifications;
    this.notifications.forEach((notification) => {
      notification.checked = false;
      notification.tooltips = "Mark Unread";
    });
    this.dataSource = new MatTableDataSource<any>(this.notifications);
    this.selection = new SelectionModel<any>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleItems(row) {
    this.selection.toggle(row);
    if (this.selection.selected.length > 0) {
      this.viewIcons = true;
    } else {
      this.viewIcons = false;
    }
    row.checked = !row.checked;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.viewIcons = true;
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    this.notifications.forEach((notification) => {
      notification.checked = !notification.checked;
    });

    this.viewIcons = this.selection.selected.length;
  }

  deleteNotifications() {
    this.notificationsService.deletedNotifications.next(
      this.notifications.filter((notification) => notification.checked === true)
    );
    this.notifications = this.notifications.filter(
      (notification) => notification.checked === false
    );
    this.notificationsService.updateNotifications(this.notifications);
    this.ngOnInit();
  }

  markAsRead() {
    this.notifications.map((notification) => {
      if (notification.checked) {
        notification.read = true;
        notification.tooltips = "Mark Read";
        this.notificationsService.markReadNotifications.next(notification);
      }
    });
    this.notifications.forEach((notification) => {
      notification.checked = false;
    });
    this.selection.clear();
  }

  readNotification(element) {
    this.notifications.map((notification) => {
      if (element.id === notification.id) {
        notification.read = !notification.read;
        if (notification.read) {
          notification.tooltips = "Mark Read";
          this.notificationsService.markReadNotifications.next(notification);
        } else {
          notification.tooltips = "Mark Unread";
          this.notificationsService.markUnreadNotifications.next(notification);
        }
      }
    });
  }
}
