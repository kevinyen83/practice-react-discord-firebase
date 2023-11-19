import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from "@angular/forms";

import { MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-task-checklist',
  templateUrl: './task-checklist.component.html',
  animations: fuseAnimations
})
export class TaskChecklistComponent implements OnInit {
  taskChecklistForm: FormGroup;
  createTask: FormArray;
  viewCreateTaskChecklist: boolean = false;
  checklists = [];
  detailChecklistForm: FormGroup;

  constructor(private matDialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.buildForm();
    this.addTaskField();
  }

  close() {
    this.matDialogRef.close();
  }

  openChecklist(item, index) {
    item['view'] = !item['view'];
    this.detailChecklistForm = new FormGroup({
      [`description${index}`]: new FormControl(item.tasks[0].taskDescription),
      [`resources${index}`]: new FormControl(item.tasks[0].taskResources)
    })

  }

  createTaskChecklist() {
    this.viewCreateTaskChecklist = true;
  }

  returnToList() {
    this.viewCreateTaskChecklist = false;
  }

  save() {

  }

  addTaskField() {
    this.createTask = this.taskChecklistForm.controls.createTask as FormArray;
    this.createTask.push(this.createItemTask());
  }

   createItemTask() {
     return new FormGroup({
       taskDescription: new FormControl(''),
       taskResources: new FormControl('')
     });
   }

  get createTaskControls() {
    return this.taskChecklistForm.get("createTask") as FormArray;
  }

  buildForm() {
    this.taskChecklistForm = new FormGroup({
      nameChecklist: new FormControl(''),
      createTask: new FormArray([])
    })
  }

  deleteResourceFields(i) {
    this.createTask.removeAt(i)
  }

  cancel() {
    this.close();
  }

  saveChecklist() {
    let taskchecklist = {
      name: this.taskChecklistForm.get('nameChecklist').value,
      tasks: this.taskChecklistForm.get('createTask').value,
      view: false
    }
    this.checklists.push(taskchecklist);
    this.viewCreateTaskChecklist = false;
  }

}
