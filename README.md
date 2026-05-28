# BarbTech — Sistema de Barbearia Digital Inteligente

O **BarbTech** é uma plataforma moderna e premium para gestão e agendamento de serviços de barbearia, unindo uma experiência de usuário de alto nível (Frontend Angular) com um ecossistema de APIs altamente escalável (Backend Django + Supabase).

---

## 🚀 Arquitetura do Projeto

- **Frontend**: Angular 21, TypeScript, Vanilla CSS moderno e responsivo (Dark Mode & Gold accents).
- **Backend**: Django 6, Django REST Framework, SimpleJWT para autenticação via JSON Web Tokens.
- **Banco de Dados & Storage**: Supabase (PostgreSQL) com Supabase Storage integrado para upload seguro de fotos e banners de capa.

---

## 🛠️ Como Executar o Backend (Django)

### 1. Pré-requisitos
Certifique-se de possuir o Python instalado (recomendado v3.10+).

### 2. Configurando o Ambiente
Navegue para a pasta do backend:
```bash
cd BarbTech
```

Crie e ative um ambiente virtual:
```bash
python -m venv venv
# No Windows:
.\venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate
```

Instale as dependências:
```bash
pip install -r requirements.txt
```

### 3. Variáveis de Ambiente
Crie um arquivo chamado `.env` dentro da pasta `BarbTech` baseado no `.env.example`:
```env
SUPABASE_URL=https://sua-url-supabase.supabase.co
SUPABASE_KEY=sua-chave-secreta-supabase
SUPABASE_BUCKET=seu-bucket-de-fotos
```

### 4. Migrações e Inicialização do Servidor
Gere e aplique as migrações no banco de dados Supabase/PostgreSQL:
```bash
python manage.py makemigrations
python manage.py migrate
```

Crie um usuário administrador se necessário:
```bash
python manage.py createsuperuser
```

Inicie o servidor de desenvolvimento:
```bash
python manage.py runserver
```
O backend estará online em `http://127.0.0.1:8000/`.

---

## 💻 Como Executar o Frontend (Angular)

### 1. Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado (recomendado v20+).

### 2. Instalação e Execução
Na raiz do projeto (onde está o `package.json` principal), instale as dependências:
```bash
npm install
```

Inicie o servidor local de desenvolvimento do Angular:
```bash
npm start
```

Abra seu navegador em `http://localhost:4200/`. A aplicação se recarregará automaticamente ao editar qualquer arquivo fonte.

---

## 🔒 Fluxo de Utilização Básico

1. **Autenticação**:
   - Faça login com o seu e-mail e senha de forma integrada tanto no login de **Clientes** quanto de **Profissionais**.
   - O sistema detecta a permissão (`is_barbeiro`) e impede que clientes acessem telas de profissionais e vice-versa.

2. **Fluxo do Profissional**:
   - Gerencie suas informações de perfil (sobre mim, endereço e fotos de perfil/banner salvas no Supabase).
   - Configure seus horários de atendimento e ative/desative atendimento domiciliar.
   - Adicione e remova novos serviços oferecidos na barbearia.
   - Veja sua agenda e edite ou exclua agendamentos existentes em tempo real.

3. **Fluxo do Cliente**:
   - Explore os serviços e barbeiros cadastrados dinamicamente na Home Page.
   - Busque serviços na caixa de pesquisa.
   - Agende horários disponíveis com o barbeiro selecionado.
   - Acesse a tela de configurações para atualizar seu perfil, cadastrar **condições especiais** (como acessibilidade e alergias) e gerenciar seus agendamentos ativos.
