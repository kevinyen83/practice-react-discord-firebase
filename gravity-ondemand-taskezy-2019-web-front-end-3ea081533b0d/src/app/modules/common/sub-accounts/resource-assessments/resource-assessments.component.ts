import { Component, Input, OnInit } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";

import { AvatarService } from "app/core/services/avatar/avatar.service";

@Component({
  selector: 'app-resource-assessments',
  templateUrl: './resource-assessments.component.html'
})
export class ResourceAssessmentsComponent implements OnInit {

  defaultAvatar;
  dataSource = new MatTableDataSource();
  displayedColumns = ['avatar', 'ratedBy', 'rating', 'note'];
  @Input() assessments;

  constructor(private avatarService: AvatarService) { }

  ngOnInit(): void {
    this.defaultAvatar = this.avatarService.defaultAvatar;
    this.dataSource = new MatTableDataSource<any>(this.assessments);
  }
  counter(i: number) {
    return new Array(i);
  }

}
