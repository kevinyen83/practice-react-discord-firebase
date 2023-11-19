import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-filter-of-members',
  templateUrl: './filter-of-members.component.html',
  animations: fuseAnimations
})
export class FilterOfMembersComponent implements OnInit {

  filterMembersForm: FormGroup;
  @Output() addMember = new EventEmitter<any>()

  constructor() { }

  ngOnInit(): void {
    this.buildForm();
  }

  toAddMember() {
    this.addMember.emit();
  }

  buildForm() {
    this.filterMembersForm = new FormGroup({
      searchBy: new FormControl(''),
      select: new FormControl('')
    })
  }

}
