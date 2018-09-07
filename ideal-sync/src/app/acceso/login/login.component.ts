import { Idle } from '@ng-idle/core';
import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MensajesService, TIPOS_MENSAJE, Identity, CargandoService, LoginService, AuthService } from 'app/shared';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'i-sync-login',
  templateUrl: './login.component.html',
  styles: [`
  img.avatar {
    cursor: pointer;
  }
  `],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  loginForm: FormGroup;
  showForm = false;
  deviceInfo = null;
  isIOS = false;
  oculta = true;

  constructor(private _router: Router,
    private _msjSrv: MensajesService,
    private _loadSrv: CargandoService,
    private _accessSrv: LoginService,
    private _builder: FormBuilder, private _title: Title,
    private _authSrv: AuthService,
    @Inject('IDLE_TIMEOUT') private timeout: number,
    private _idle: Idle,
    private deviceService: DeviceDetectorService) {
    this._title.setTitle('Acceso Sync');
    this.loginForm = this._builder.group({
      Usuario: ['', Validators.required],
      Contrasenia: ['', Validators.required]
    });
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isIOS = String(this.deviceInfo.device) === 'iphone' || String(this.deviceInfo.device) === 'ipad';
  }

  onSubmit() {
    this._loadSrv.toggle(true);
    const data = <Identity>this.loginForm.value;
    this._accessSrv
      .login(data)
      .toPromise()
      .then(usuario => {
        this._authSrv.login(usuario);
        if (usuario) {
          this._loadSrv.toggle(false);
          if (this._idle.isRunning) {
            this._idle.interrupt();
          }
          this._idle.watch();
          if (this._authSrv.redirectUrl && this._authSrv.redirectUrl.length > 0) {
            this._router.navigateByUrl(this._authSrv.redirectUrl);
            this._authSrv.redirectUrl = null;
          } else {
            this._router.navigate(['/']);
            // if (usuario.admin) {
            //   this._router.navigate(['/admin']);
            // } else {
            //   this._router.navigate(['/promotor']);
            // }
          }
        } else {
          this._loadSrv.toggle(false);
          this._msjSrv.agregaError('No se encontró el usuario');
        }
      })
      .catch(error => {
        this._loadSrv.toggle(false);
        this._msjSrv.agregaError(error);
      });
  }

}
