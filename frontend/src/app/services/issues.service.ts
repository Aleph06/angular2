import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Issue } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  private uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.uri}/issues`);
  }

  getIssueById(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.uri}/issues/${id}`);
  }

  addIssue(title: string, responsible: string, description: string, severity: string) {
    const issue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity
    };
    return this.http.post(`${this.uri}/issues/add`, issue);
  }

  updateIssue(id: string, title: string, responsible: string, description: string, severity: string, status: string) {
    const issue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity,
      status: status
    };
    return this.http.post(`${this.uri}/issues/update/${id}`, issue);
  }

  deleteIssue(id) {
    return this.http.get(`${this.uri}/issues/delete/${id}`);
  }

}
