import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TelaLoginProfissional } from './tela-login-profissional/tela-login-profissional';
import { FormsModule } from '@angular/forms';
import { TelaInicial } from './tela-inicial/tela-inicial';
import { TelaLoginUsuario } from './tela-login-usuario/tela-login-usuario';
import { CadastroProfissional } from './cadastro-profissional/cadastro-profissional';
import { CadastroCliente } from './cadastro-cliente/cadastro-cliente';
import { Header } from './header/header';
import { HomePage } from './home-page/home-page';
import { Rodape } from './rodape/rodape';

@NgModule({
  declarations: [
    App,
    TelaLoginProfissional,
    TelaInicial,
    TelaLoginUsuario,
    CadastroProfissional,
    CadastroCliente,
    Header,
    HomePage,
    Rodape,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
