import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterviewsService {
  allInterviews = [];
  templates = [];

  constructor(private http: HttpClient) { }

  getInterviewsAdmins() {
    return this.http.get('api/interviews-admin').pipe(
      tap((res: any[]) => {
        this.allInterviews = res;
      })
    );
  }

  postInterview(interview): Observable<any> {
    return this.http.post('api/interviews-admin', interview).pipe(
      tap((res) => {
        this.allInterviews.push(interview);
      })
    );
  }

  getTemplates() {
    return this.http.get('api/interview-templates').pipe(
      tap((res: any) => {
        this.templates = res;
      })
    );
  }

  postTemplate(template) {
    return this.http.post('api/interview-templates', template).pipe(
      tap((res: any) => {
        this.templates = [
          ...this.templates,
          template
        ];
      })
    );
  }

  putTemplate(template) {
    return this.http.put(`api/interview-templates/${template.id}`, template).pipe(
      tap((res: any) => {
        const templateIndex = this.templates.findIndex((item) => item.id === template.id);
        if (templateIndex >= 0) {
          this.templates.splice(templateIndex, 1, template);
        }
      })
    );
  }

  getInterviewsResource(): Observable <any> {
    return this.http.get('api/interviews-resources');
  }

  postInterviewResource(interview): Observable<any> {
    return this.http.post('api/interviews-resources', interview).pipe(
      // tap((res) => {
      //   this.interviews.push(interview);
      // })
    );
  }
}
