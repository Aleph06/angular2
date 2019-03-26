import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../services';
import { Issue } from '../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'f-mean-create',
  templateUrl: './create.component.html',
  styles: []
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;

  constructor(private issueSrv: IssuesService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      responsible: '',
      description: '',
      severity: ['Low', Validators.required]
    });
  }

  addIssue() {
    const issue = <Issue>this.createForm.getRawValue();
    if (this.createForm.valid) {
      this.issueSrv.addIssue(issue.title, issue.responsible, issue.description, issue.severity)
        .subscribe(() => {
          this.router.navigate(['/list']);
        });
    }
  }

}
