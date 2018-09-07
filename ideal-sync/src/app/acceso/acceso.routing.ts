import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from 'app/shared';
import { LoginComponent } from './login/login.component';
import { RecuperaPwdComponent } from './recupera-pwd/recupera-pwd.component';

const routes: Routes = [
  {
    path: 'login',
    children: [
      { path: '', component: LoginComponent, canActivate: [LoginGuard] },
      { path: 'recupera-psw', component: RecuperaPwdComponent, canActivate: [LoginGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
