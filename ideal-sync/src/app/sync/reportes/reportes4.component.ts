import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { CargandoService } from '../../shared';
import { UtilsService } from './shared';

@Component({
  selector: 'i-sync-reportes',
  template: `<iframe *ngIf="rutaReporte" style="width: 100%; border: 0; height: 700px;" (load)="finishLoadIframe()" 
  scrolling="no" 
  [src]="rutaReporte">
</iframe>`
})
export class Reporte4Component implements OnInit {

  hostssrs: string;
  rutaReporte: any;

  constructor(private _cargandoSrv: CargandoService,
    private route: ActivatedRoute,
    private router: Router,
    private utilSrv: UtilsService, private sanitizer: DomSanitizer) {
    this.utilSrv.getUrlSSRS()
      .then(ruta => {
        this.hostssrs = '//' + ruta;
        this.rutaReporte = sanitizer
          .bypassSecurityTrustResourceUrl(
            this.hostssrs + '/ReportServer/Pages/ReportViewer.aspx?%2fReportesIDEALSYNC%2fIdealSyncRep05&rs:Command=Render'
            );
      });
  }

  ngOnInit() {
    this._cargandoSrv.toggle(true);
  }

  finishLoadIframe(): void {
    this._cargandoSrv.toggle(false);
  }

}
