import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'mnx-page-not-found',
  template: `<mnx-error-page
                error="Página no encontrada"
                errorCode="404"
                mensaje="El recurso que intenta consultar no esta disponible.">
              </mnx-error-page>`
})
export class PageNotFoundComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Página no encontrada');
  }

}
