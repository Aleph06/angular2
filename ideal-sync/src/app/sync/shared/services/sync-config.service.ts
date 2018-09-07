import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavItem } from '../models';
import { StoreManagement } from 'app/shared';

@Injectable()
export class SyncConfigService {

  private isDarkTheme: BehaviorSubject<boolean>;
  isDarkTheme$: Observable<boolean>;
  private appName = new BehaviorSubject<string>('Sync');
  appName$ = this.appName.asObservable();
  private navItems = new BehaviorSubject<NavItem[]>([]);
  navItems$ = this.navItems.asObservable();

  constructor(private storageSrv: StoreManagement) {
    this.isDarkTheme = new BehaviorSubject<boolean>(this.storageSrv.getDark());
    this.isDarkTheme$ = this.isDarkTheme.asObservable();
  }

  set isDark(isDark: boolean) {
    this.storageSrv.saveDark(isDark);
    this.isDarkTheme.next(isDark);
  }

  set app(app: string) {
    this.appName.next(app);
  }

  set itemsMenu(items: NavItem[]) {
    this.navItems.next(items);
  }

}
