import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaLoginProfissional } from './tela-login-profissional/tela-login-profissional';
import { TelaInicial } from './tela-inicial/tela-inicial';
import { TelaLoginUsuario } from './tela-login-usuario/tela-login-usuario';
import { CadastroProfissional } from './cadastro-profissional/cadastro-profissional';
import { CadastroCliente } from './cadastro-cliente/cadastro-cliente';
import { HomePage } from './home-page/home-page';
import { ConfiguracaoClienteComponent } from './configuracao-cliente/configuracao-cliente.component';
import { TelaProfissionalPainel } from './tela-profissional-painel/tela-profissional-painel';
import { TelaAgendamento } from './tela-agendamento/tela-agendamento';
import { ListaBarbeiro } from './lista-barbeiro/lista-barbeiro';
import { ListaServico } from './lista-servico/lista-servico';
import { HomeProfissional } from './home-profissional/home-profissional';

import { profissionalGuard, clienteGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/tela-inicial', pathMatch: 'full'},
  {path: 'tela-inicial', component: TelaInicial},
  {path: 'login-profissional', component: TelaLoginProfissional},
  {path: 'login-usuario', component: TelaLoginUsuario},
  {path: 'cadastro-profissional', component: CadastroProfissional},
  {path: 'cadastro-cliente', component: CadastroCliente},
  {path: 'home-page', component: HomePage, canActivate: [clienteGuard]},
  {path: 'configuracao-cliente', component: ConfiguracaoClienteComponent, canActivate: [clienteGuard]},
  {path: 'configuracao-profissional', component: TelaProfissionalPainel, canActivate: [profissionalGuard]},
  {path: 'agendamento', component: TelaAgendamento, canActivate: [clienteGuard]},
  {path: 'lista-barbeiro', component: ListaBarbeiro, canActivate: [clienteGuard] },
  {path: 'lista-servico', component: ListaServico, canActivate: [clienteGuard] },
  {path: 'home-profissional', component: HomeProfissional, canActivate: [profissionalGuard]},
  { path: 'agendamento/:id', component: TelaAgendamento, canActivate: [clienteGuard] },
  { path: 'lista-barbeiro/:servico', component: ListaBarbeiro, canActivate: [clienteGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
