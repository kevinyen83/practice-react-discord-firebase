import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-answers-interviews',
  templateUrl: './answers-interviews.component.html',
  animations: fuseAnimations
})
export class AnswersInterviewsComponent implements OnInit {
  answersForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.createAnswersForm();
  }

  createAnswersForm() {
    this.answersForm = new FormGroup({
      name: new FormControl(''),
      country: new FormControl(''),
      licence: new FormControl(''),
      description: new FormControl(''),
      selection: new FormControl('')
    });
  }

}
