import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
@Component({
  selector: 'not-authorized',
  template: `<mnx-bitacoras-cdc-error-page
                error="Sin autorización"
                errorCode="403"
                mensaje="No cuenta con la autorización para consultar el recurso solicitado."
                faIcon="fa-pencil"
              >
              </mnx-bitacoras-cdc-error-page>`
})
export class NotAuthorizedComponent implements OnInit {

  constructor(private titleService: Title ) { }

  ngOnInit() {
    this.titleService.setTitle( "Sin autorización" );
  }

}
