import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'mnx-bitacoras-cdc',
  templateUrl: './mnx-bitacoras-cdc.component.html',
  styleUrls: ['./mnx-bitacoras-cdc.component.css']
})
export class MnxBitacorasCDCComponent implements OnInit {

  title: string;
  metadata: any;
  llave: Array<{ [key: string]: string }>;

  constructor(private _cookieSrv: CookieService,
    private _titleSrv: Title) {
  }

  ngOnInit() {
    this.title = 'Bitácoras CDC - Monex';
    this._titleSrv.setTitle('Bitácoras CDC - Monex');
    let cookieSession = this._cookieSrv.get('_s_');
    if (cookieSession !== null && cookieSession !== undefined) {
      console.log('Has cookie', cookieSession);

    }
    this.metadata = { conjuntoCambios: 'CONTABILIDAD', tabla: 'CB_CONF_OPERACION' };

    this.llave = [{ ['CVE_ENTIDAD']: 'MONEX' }, { ['CVE_OPERACION']: 'RETESOFE' }];
  }

}
