import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mnx-bitacoras-cdc-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  @Input() error: string;
  @Input() errorCode: string;
  @Input() mensaje: string;
  @Input() faIcon: string;

  constructor() { }

  ngOnInit() {
  }

}
