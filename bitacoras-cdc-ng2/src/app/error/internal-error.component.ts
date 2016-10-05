import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'internal-error',
  template: `<mnx-error-page
                error="Error interno"
                errorCode="500"
                mensaje="Ocurrió un problema en el servicio, intentelo mas tarde.">
              </mnx-error-page>`
})
export class InternalErrorComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Error interno');
  }

}
