import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../services';
import { Issue } from '../../models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'f-mean-list',
  templateUrl: './list.component.html',
  styles: []
})
export class ListComponent implements OnInit {

  issues: Observable<Issue[]>;
  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];

  constructor(private issueSrv: IssuesService, private router: Router) { }

  ngOnInit() {
    this.issues = this.issueSrv.getIssues();
  }

  editIssue(id: string): void {
    this.router.navigate([`/edit/${id}`]);
  }

  deleteIssue(id: string): void {
    this.issueSrv.deleteIssue(id).subscribe(() => {
      this.issues = this.issueSrv.getIssues();
    });
  }

}
