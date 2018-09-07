import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

import { AuthService } from './auth.service';

@Injectable()
export class IdlebootService {

  constructor(private _idle: Idle,
    private _authSrv: AuthService) {
  }

  start(timeout: number): void {
    // console.log('IdlebootService::start');
    this._idle.setIdle(timeout - 5);
    this._idle.setTimeout(5);
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // this._idle.onIdleEnd.subscribe(() => { console.log('Idle restart'); });
    this._idle.onTimeout.subscribe(() => {
      this.stop();
      this._authSrv.logout();
      window.location.reload();
    });
    // this._idle.onIdleStart.subscribe(() => { console.log('Inactivo'); });
    this._idle.onTimeoutWarning.subscribe((countdown) => { console.log(`Conteo... ${countdown}`); });
    this._idle.watch();
  }

  stop(): void {
    // console.log('IdlebootService::stop');
    this._idle.stop();
  }

}
