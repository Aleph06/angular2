import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService, CargandoService, IdlebootService, SessionService } from 'app/shared';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SyncConfigService, NavItem } from './shared';

@Component({
  selector: 'i-sync-sync',
  templateUrl: './sync.component.html',
  styles: [],
  providers: [SyncConfigService]
})
export class SyncComponent implements OnInit, OnDestroy {

  usuario: string;
  nombreApp: string;
  darkTheme = false;
  private destroyed$: Subject<{}> = new Subject();
  isAdmin = false;
  navItems: NavItem[];

  constructor(private _title: Title, private router: Router,
    private _element: ElementRef,
    private _overlayContainer: OverlayContainer,
    private _authSrv: AuthService,
    private _loadSrv: CargandoService,
    private _idle: IdlebootService, private ssnSrv: SessionService,
    private config: SyncConfigService) {
    config.isDarkTheme$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(isDarktheme => this.setTheme(isDarktheme));
    config.appName$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(appName => this.setNombreapp(appName));
    config.navItems$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(items => this.setNavItems(items));
    config.app = 'Sync';
    // config.isDark = false;
    this.usuario = ssnSrv.principal.Usuario;
    this.isAdmin = ssnSrv.isAdmin;
    config.itemsMenu = [
      {
        nombre: 'Usuarios', descripcion: 'Usuarios', icon: 'person', items: [
          { nombre: 'Permisos', descripcion: 'Permisos', ruta: '/usuarios', icon: 'person' }
        ]
      },
      {
        nombre: 'Agencias', descripcion: 'Agencias', icon: 'store_mall_directory', items: [
          { nombre: 'Nueva', descripcion: 'Nueva', ruta: '/agencias/nueva', icon: 'add_box' },
          { nombre: 'Administrar', descripcion: 'Administrar', ruta: '/agencias', icon: 'settings_applications' },
          { nombre: 'Cargas', descripcion: 'Cargas', ruta: '/agencias/cargas', icon: 'cloud_upload' }
        ]
      },
      {
        nombre: 'Reportes', descripcion: 'Reportes', icon: 'chart', items: [
          { nombre: 'Reporte Tickets Procesados', descripcion: 'Reporte Tickets Procesados', icon: 'insert_chart', ruta: '/reportes/1' },
          { nombre: 'Reporte Tickets Acumulado', descripcion: 'Reporte Tickets Procesados', icon: 'insert_chart', ruta: '/reportes/2' },
          { nombre: 'Reporte Log Proceso Nocturno', descripcion: 'Reporte Tickets Procesados', icon: 'insert_chart', ruta: '/reportes/3' },
          { nombre: 'Reportes de Tickets por Folio', descripcion: 'Reporte Tickets Procesados', icon: 'insert_chart', ruta: '/reportes/4' },
          { nombre: 'Reporte de Tickets por Periodo', descripcion: 'Reporte Tickets Procesados',
          icon: 'insert_chart', ruta: '/reportes/5' },
          { nombre: 'Reporte de cargas por entronque', descripcion: 'Reporte Tickets Procesados',
           icon: 'insert_chart', ruta: '/reportes/6' }
        ]
      }
    ];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed$.next(); /* Emit a notification on the subject. */
  }
  cerrarSesion() {
    this._loadSrv.toggle(true);
    this._idle.stop();
    this._authSrv.logout();
    this._loadSrv.toggle(false);
    this.router.navigate(['login']);
    window.location.reload();
  }

  toggleTheme() {
    console.log('toogleTheme');
    this.config.isDark = !this.darkTheme;
  }

  setTheme(isDark: boolean) {
    this.darkTheme = isDark;
    const darkThemeClass = 'sync-dark-theme';
    if (this.darkTheme) {
      this._element.nativeElement.classList.add(darkThemeClass);
      this._overlayContainer.getContainerElement().classList.add(darkThemeClass);
    } else {
      this._element.nativeElement.classList.remove(darkThemeClass);
      this._overlayContainer.getContainerElement().classList.remove(darkThemeClass);
    }
  }

  setNombreapp(nombre: string) {
    this.nombreApp = nombre;
    this._title.setTitle(`Sync - ${nombre}`);
  }

  setNavItems(items: NavItem[]) {
    this.navItems = items;
  }

}
