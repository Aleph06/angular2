import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'i-sync-error-page',
  templateUrl: './error-page.component.html'
})
export class ErrorPageComponent implements OnInit {

  @Input() error: string;
  @Input() errorCode: string;
  @Input() mensaje: string;
  @Input() faIcon: string;

  constructor(private route: Router) { }

  ngOnInit() {
  }

  irAInicio(): void {
    this.route.navigate(['/']);
  }

}
