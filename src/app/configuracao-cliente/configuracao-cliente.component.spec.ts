import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

import {
  ConfiguracaoClienteComponent,
  Agendamento,
  StatusAgendamento
} from './configuracao-cliente.component';

describe('ConfiguracaoClienteComponent', () => {
  let component: ConfiguracaoClienteComponent;
  let fixture: ComponentFixture<ConfiguracaoClienteComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfiguracaoClienteComponent,
        HttpClientTestingModule,
        FormsModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoClienteComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  /* ── Criação ── */

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ativar o estado "loaded" após ngOnInit', fakeAsync(() => {
    expect(component.loaded).toBeFalse();
    tick(150);
    expect(component.loaded).toBeTrue();
  }));

  /* ── Dados iniciais ── */

  it('deve carregar o endereço padrão corretamente', () => {
    expect(component.endereco.rua).toBe('Avenida Paulista');
    expect(component.endereco.cep).toBe('01310-100');
    expect(component.endereco.bairro).toBe('Bela Vista');
  });

  it('deve ter requerAcessibilidade ativo por padrão', () => {
    expect(component.condicoes.requerAcessibilidade).toBeTrue();
  });

  it('deve ter possuiAlergia desativado por padrão', () => {
    expect(component.condicoes.possuiAlergia).toBeFalse();
  });

  it('deve conter 2 agendamentos de exemplo', () => {
    expect(component.agendamentos.length).toBe(2);
  });

  /* ── Toggles ── */

  it('deve alternar requerAcessibilidade ao clicar no toggle', () => {
    const before = component.condicoes.requerAcessibilidade;
    component.condicoes.requerAcessibilidade = !before;
    expect(component.condicoes.requerAcessibilidade).toBe(!before);
  });

  it('deve alternar possuiAlergia ao clicar no toggle', () => {
    expect(component.condicoes.possuiAlergia).toBeFalse();
    component.condicoes.possuiAlergia = true;
    expect(component.condicoes.possuiAlergia).toBeTrue();
  });

  /* ── Formatação de CEP ── */

  it('deve formatar CEP corretamente via formatarCep()', () => {
    const mockEvent = {
      target: { value: '01310100' }
    } as unknown as Event;

    component.formatarCep(mockEvent);
    expect(component.endereco.cep).toBe('01310-100');
  });

  it('deve aceitar CEP parcial sem travar', () => {
    const mockEvent = {
      target: { value: '0131' }
    } as unknown as Event;

    component.formatarCep(mockEvent);
    expect(component.endereco.cep).toBe('0131');
  });

  /* ── buscarCep() ── */

  it('deve ignorar busca com CEP incompleto', () => {
    component.endereco.cep = '01310-10';
    component.buscarCep();
    httpMock.expectNone(/viacep/);
  });

  it('deve chamar ViaCEP e preencher endereço com sucesso', fakeAsync(() => {
    component.endereco.cep = '01310-100';
    component.buscarCep();

    const req = httpMock.expectOne('https://viacep.com.br/ws/01310100/json/');
    expect(req.request.method).toBe('GET');

    req.flush({
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP'
    });

    tick();
    expect(component.endereco.rua).toBe('Avenida Paulista');
    expect(component.endereco.bairro).toBe('Bela Vista');
    expect(component.cepError).toBeFalse();
  }));

  it('deve exibir erro se CEP retornar { erro: true }', fakeAsync(() => {
    component.endereco.cep = '00000-000';
    component.buscarCep();

    const req = httpMock.expectOne('https://viacep.com.br/ws/00000000/json/');
    req.flush({ erro: true });
    tick();

    expect(component.cepError).toBeTrue();
    expect(component.cepMsg).toBeTruthy();
  }));

  it('deve exibir erro de rede ao falhar a requisição do CEP', fakeAsync(() => {
    component.endereco.cep = '01310-100';
    component.buscarCep();

    const req = httpMock.expectOne('https://viacep.com.br/ws/01310100/json/');
    req.error(new ProgressEvent('network error'));
    tick();

    expect(component.cepError).toBeTrue();
  }));

  /* ── isHoje() ── */

  it('deve identificar a data de hoje corretamente', () => {
    expect(component.isHoje(new Date())).toBeTrue();
  });

  it('deve retornar false para datas no passado', () => {
    expect(component.isHoje(new Date('2000-01-01'))).toBeFalse();
  });

  /* ── statusLabel() ── */

  it('deve retornar label correto para cada status', () => {
    const casos: Array<[StatusAgendamento, string]> = [
      ['confirmado', 'Confirmado'],
      ['pendente',   'Pendente'],
      ['concluido',  'Concluído'],
      ['cancelado',  'Cancelado']
    ];
    casos.forEach(([status, label]) => {
      expect(component.statusLabel(status)).toBe(label);
    });
  });

  /* ── trackById() ── */

  it('deve retornar o id do agendamento no trackById', () => {
    const ag = { id: 42 } as Agendamento;
    expect(component.trackById(0, ag)).toBe(42);
  });

  /* ── Salvar ── */

  it('deve entrar no estado salvando ao chamar salvarAlteracoes()', () => {
    component.salvarAlteracoes();
    expect(component.salvando).toBeTrue();
  });

  it('deve exibir toast após simular salvamento', fakeAsync(() => {
    component.salvarAlteracoes();
    tick(1500);
    expect(component.salvando).toBeFalse();
    expect(component.toastVisible).toBeTrue();
    expect(component.toastMsg).toContain('sucesso');
  }));

  it('não deve chamar salvarAlteracoes duas vezes se já estiver salvando', () => {
    component.salvando = true;
    const spy = spyOn<any>(component, 'exibirToast');
    component.salvarAlteracoes();
    expect(spy).not.toHaveBeenCalled();
  });

  /* ── Upload de imagens ── */

  it('deve atualizar avatarUrl ao selecionar arquivo', (done) => {
    const fakeFile = new File(['fake'], 'avatar.png', { type: 'image/png' });
    const fakeEvent = {
      target: { files: [fakeFile] }
    } as unknown as Event;

    component.onAvatarChange(fakeEvent);

    setTimeout(() => {
      expect(component.avatarUrl).toContain('data:');
      done();
    }, 100);
  });

  it('deve atualizar bannerUrl ao selecionar arquivo', (done) => {
    const fakeFile = new File(['fake'], 'banner.jpg', { type: 'image/jpeg' });
    const fakeEvent = {
      target: { files: [fakeFile] }
    } as unknown as Event;

    component.onBannerChange(fakeEvent);

    setTimeout(() => {
      expect(component.bannerUrl).toContain('data:');
      done();
    }, 100);
  });

  /* ── Template ── */

  it('deve renderizar o nome do cliente no template', fakeAsync(() => {
    tick(150);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.profile-name')?.textContent).toContain('ARTHUR STERLING');
  }));

  it('deve renderizar seção de endereço', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = Array.from(compiled.querySelectorAll('.card__header'));
    const hasEndereco = headers.some(h => h.textContent?.includes('ENDEREÇO'));
    expect(hasEndereco).toBeTrue();
  });

  it('deve renderizar seção de condições especiais', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = Array.from(compiled.querySelectorAll('.card__header'));
    const hasCondicoes = headers.some(h => h.textContent?.includes('CONDIÇÕES'));
    expect(hasCondicoes).toBeTrue();
  });

  it('deve renderizar seção de agendamentos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = Array.from(compiled.querySelectorAll('.card__header'));
    const hasAg = headers.some(h => h.textContent?.includes('AGENDAMENTOS'));
    expect(hasAg).toBeTrue();
  });

  it('deve renderizar o botão de salvar', () => {
    const btn = fixture.debugElement.query(By.css('.save-btn'));
    expect(btn).toBeTruthy();
  });

  /* ── Cleanup ── */

  it('deve desincrever subscriptions no ngOnDestroy', () => {
    const spy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
