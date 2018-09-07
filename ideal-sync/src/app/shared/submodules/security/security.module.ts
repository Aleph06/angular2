import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, AdminGuard, LoginGuard, RolGuard } from './guards';
import { AuthService, IdlebootService } from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [AuthService, AuthGuard, AdminGuard, LoginGuard, RolGuard, IdlebootService]
})
export class SecurityModule { }
