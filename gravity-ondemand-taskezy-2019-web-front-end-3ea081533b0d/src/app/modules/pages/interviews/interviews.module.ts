import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { InterviewsComponent } from './interviews.component';
// import { FuseSharedModule } from '@fuse/shared.module';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { TemplatesInterviewsComponent } from './templates-interviews/templates-interviews.component';
import { AnswersInterviewsComponent } from './answers-interviews/answers-interviews.component';
import { TemplatesInterviewFormComponent } from './templates-interview-form/templates-interview-form.component';
import { AnswerOptionFormComponent } from './templates-interview-form/answer-option-form/answer-option-form.component';
import { CompletedInterviewsComponent } from './completed-interviews/completed-interviews.component';
import { SharedModule } from '../../../shared/shared.module';
import {FuseAlertModule} from "@fuse/components/alert";

const routes: Routes = [
  {
    path     : '',
    component: InterviewsComponent
  }
];


@NgModule({
  declarations: [
    InterviewsComponent,
    AddInterviewComponent,
    TemplatesInterviewsComponent,
    AnswersInterviewsComponent,
    TemplatesInterviewFormComponent,
    AnswerOptionFormComponent,
    CompletedInterviewsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,FuseAlertModule,
    
  ]
})
export class InterviewsModule { }
