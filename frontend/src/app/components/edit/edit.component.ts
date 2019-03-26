import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../services';
import { Issue } from '../../models';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'f-mean-edit',
  templateUrl: './edit.component.html',
  styles: []
})
export class EditComponent implements OnInit {

  id: string;
  issue$: Observable<Issue>;
  updateForm: FormGroup;

  constructor(private issueSrv: IssuesService, private router: Router,
    private route: ActivatedRoute, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      responsible: '',
      description: '',
      severity: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.issue$ = this.route.paramMap.pipe(
      tap(params => this.id = params.get('id')),
      switchMap((params: ParamMap) => this.issueSrv.getIssueById(params.get('id'))),
      tap(issue => this.updateForm.patchValue(issue))
    );
  }

  updateIssue(): void {
    const issue = <Issue>this.updateForm.getRawValue();
    this.issueSrv.updateIssue(this.id, issue.title, issue.responsible, issue.description, issue.severity, issue.status)
      .subscribe(() => {
        this.snackBar.open('Issue updated successfully', 'OK', {
          duration: 3000,
        });
      });
  }

}
