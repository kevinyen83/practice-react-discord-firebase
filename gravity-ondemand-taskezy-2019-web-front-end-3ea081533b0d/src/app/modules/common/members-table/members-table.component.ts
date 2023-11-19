import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";

import { MatTableDataSource } from "@angular/material/table";
import { AvatarService } from "app/core/services/avatar/avatar.service";
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-members-table',
  templateUrl: './members-table.component.html',
  animations: fuseAnimations
})
export class MembersTableComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  defaultAvatar;
  displayedColumns = [
    "pic",
    "name",
    "email",
    "phone",
    "role",
    "department",
    "address",
    "activeLink",
  ];
  @Input() members;
  @Output() toForm = new EventEmitter<any>();

  constructor(private avatarService: AvatarService,
              private router: Router) { }

  ngOnInit(): void {
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.dataSource = new MatTableDataSource<any>(this.members);
  }

  toEditMember(row) {
    this.router.navigate([`pages/list-members/${row.uuid}`]);
  }

  deleteMember(row) {
    this.members = this.members.filter(m => m.uuid !== row.uuid);
    this.dataSource = new MatTableDataSource<any>(this.members);
  }

  sortData(event) {}

}
