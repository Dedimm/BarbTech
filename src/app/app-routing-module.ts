import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaLoginProfissional } from './tela-login-profissional/tela-login-profissional';
import { TelaInicial } from './tela-inicial/tela-inicial';

const routes: Routes = [
  {path: '', redirectTo: '/tela-inicial', pathMatch: 'full'},
  {path: 'tela-inicial', component: TelaInicial},
  {path: 'login-profissional', component: TelaLoginProfissional}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
