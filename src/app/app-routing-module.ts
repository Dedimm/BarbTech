import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaLoginProfissional } from './tela-login-profissional/tela-login-profissional';
import { TelaInicial } from './tela-inicial/tela-inicial';
import { TelaLoginUsuario } from './tela-login-usuario/tela-login-usuario';
import { CadastroProfissional } from './cadastro-profissional/cadastro-profissional';

const routes: Routes = [
  {path: '', redirectTo: '/tela-inicial', pathMatch: 'full'},
  {path: 'tela-inicial', component: TelaInicial},
  {path: 'login-profissional', component: TelaLoginProfissional},
  {path: 'login-usuario', component: TelaLoginUsuario},
  {path: 'cadastro-profissional', component: CadastroProfissional},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
