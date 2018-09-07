import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'i-sync-not-authorized',
  template: `<i-sync-error-page
                error="Sin autorización"
                errorCode="403"
                mensaje="No cuenta con la autorización para consultar el recurso solicitado.">
              </i-sync-error-page>`
})
export class NotAuthorizedComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Sin autorización');
  }

}
