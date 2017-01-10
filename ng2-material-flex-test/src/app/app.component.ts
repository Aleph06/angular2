import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/filter';
import { MediaChange, MatchMediaObservable } from '@angular/flex-layout';

@Component({
  selector: 'tst-root',
  templateUrl: './app.component.html',
  styles: [`.input-full-width { width: 100%; } 
  md-option { font-size: 95%; height: 36px;} 
  [fxflex] { padding: 10px; }
  [fxLayout] { padding: 10px; }
  md-card-footer > div { width: 96%; left: 2%; position: relative; padding: 3px; color: rgba(0, 0, 0, 0.38); }`]
})
export class AppComponent implements OnInit, OnDestroy {
  private _watcher: Subscription;
  public activeMediaQuery = '';

  constructor( @Inject(MatchMediaObservable) private _media$) { }

  ngOnInit() {
    this._watcher = this.watchMQChanges();
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  watchMQChanges() {
    return this._media$.subscribe((change: MediaChange) => {
      let value = change ? `'${change.mqAlias}' = ${change.mediaQuery} )` : '';
      this.activeMediaQuery = value;
    });
  }
}
