import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
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
import { TelaProfissionalPainel } from './tela-profissional-painel/tela-profissional-painel';
import { TelaAgendamento } from './tela-agendamento/tela-agendamento';
import { ServicoComponent } from './servico-component/servico-component';
import { AgendaComponent } from './agenda-component/agenda-component';
import { ListaBarbeiro } from './lista-barbeiro/lista-barbeiro';
import { ListaServico } from './lista-servico/lista-servico';

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
    TelaProfissionalPainel,
    TelaAgendamento,
    ServicoComponent,
    AgendaComponent,
    ListaBarbeiro,
    ListaServico,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
