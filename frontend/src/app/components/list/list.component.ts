import { Component, OnInit, ViewChild } from '@angular/core';
import { IssuesService } from '../../services';
import { Issue } from '../../models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatTable, Sort } from '@angular/material';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'f-mean-list',
  templateUrl: './list.component.html',
  styles: [`
  .mat-column-right {
    text-align: center;
  }
  mat-row.selected {
    background: rgba(0,0,0,0.12);
  }
  mat-row {
    cursor: pointer;
  }
  .mat-header-cell{
    font-size: 14px;
  }
  .mat-header-cell.mat-column-actions {
    display:flex;
    justify-content:space-evenly;
  }
  `]
})
export class ListComponent implements OnInit {

  issues: Observable<Issue[]>;
  displayedColumns = ['title', 'responsible', 'severity', 'status'];

  selection: SelectionModel<Issue>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Issue>;

  constructor(private issueSrv: IssuesService, private router: Router) { }

  ngOnInit() {
    this.issues = this.issueSrv.getIssues();
    this.selection = new SelectionModel<Issue>(false, []);
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.issues = this.issueSrv.getIssues().pipe(
        map(issues => issues.sort((a, b) => (sort.direction === 'asc'
          ? String(b[sort.active]).localeCompare(String(a[sort.active]))
          : String(a[sort.active]).localeCompare(String(b[sort.active]))
        ))),
        tap(() => { this.table.renderRows(); this.selection.clear(); })
      );
    });
  }

  editIssue(): void {
    this.router.navigate([`/edit/${this.selection.selected[0]['_id']}`]);
  }

  deleteIssue(): void {
    this.issueSrv.deleteIssue(this.selection.selected[0]['_id']).subscribe(() => {
      this.issues = this.issueSrv.getIssues();
    });
  }

  select(issue: Issue): void {
    if (this.selection.isSelected(issue)) {
      this.selection.deselect(issue);
    } else {
      this.selection.select(issue);
    }
  }

}
