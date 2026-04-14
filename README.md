# Gestão de Empresas

Sistema completo de cadastro e gerenciamento de empresas com autenticação JWT, validação automática de CNPJ e preenchimento de endereço por CEP.

<p align="center"> <img src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=java&logoColor=white" /> <img src="https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" /> <img src="https://img.shields.io/badge/React-Framework-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" /> <img src="https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white" /> <img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" />
</p>

<hr>

<h3>🎬 Demonstração da API</h3>
<p>
<img src="https://i.postimg.cc/WzXzP2FJ/2026-04-13-18-04-13.gif" alt="Demonstração do CRUD" />
</p>
---

## Pré-requisitos

Instale apenas isso (não precisa de Java, Node ou PostgreSQL na sua máquina):

| Ferramenta | Download | Verificar instalação |
|---|---|---|
| Docker Desktop | https://www.docker.com/products/docker-desktop | `docker --version` |
| Git | https://git-scm.com | `git --version` |

---

## Como rodar (3 comandos)

```bash
# 1. Clone o repositório
git clone https://github.com/euudanilo/gestao-empresarial.git
cd gestao-empresarial

# 2. Suba tudo — banco + backend + frontend
docker compose up --build

# 3. Acesse no navegador
# http://localhost:3000
```

Na primeira vez o `--build` demora alguns minutos (baixa as imagens e compila). Da segunda vez em diante use só `docker compose up` — muito mais rápido.

**Credenciais de acesso:**
- Usuário: `admin`
- Senha: `admin123`

---

## Estrutura do repositório

```
/
├── backend/                        ← Projeto Spring Boot
│   ├── src/
│   │   └── main/java/.../
│   │       ├── auth/               ← Autenticação JWT
│   │       │   ├── controller/     ← AuthController
│   │       │   ├── dto/            ← LoginRequest, LoginResponse
│   │       │   ├── filter/         ← JwtAuthFilter
│   │       │   └── service/        ← AuthService, JwtService, UsuarioDetailsService
│   │       ├── config/             ← SecurityConfig, CorsConfig
│   │       ├── controller/         ← EmpresaController
│   │       ├── domain/
│   │       │   ├── entity/         ← Empresa, Usuario
│   │       │   ├── repository/     ← EmpresaRepository, UsuarioRepository
│   │       │   └── service/        ← EmpresaService
│   │       ├── dto/                ← EmpresaCreateRequest, EmpresaResponse, EmpresaUpdateRequest
│   │       ├── integration/
│   │       │   ├── brasilapi/      ← BrasilApiClient, CepResponse, CnpjResponse
│   │       │   └── config/         ← HttpClientConfig
│   │       └── shared/
│   │           ├── exception/      ← BusinessException, ConflictException, NotFoundException
│   │           └── util/           ← Normalizer
│   ├── pom.xml
│   └── Dockerfile
│
├── empresa-frontend/               ← Projeto React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx   ← Diálogo de confirmação de exclusão
│   │   │   ├── EmpresaDetail.jsx   ← Tela de detalhes da empresa
│   │   │   ├── EmpresaForm.jsx     ← Formulário criar / editar
│   │   │   ├── Logo.jsx            ← Logo SVG inline
│   │   │   └── Modal.jsx           ← Modal reutilizável
│   │   ├── pages/
│   │   │   └── LoginPage.jsx       ← Tela de login
│   │   ├── services/
│   │   │   ├── authService.js      ← Login, logout, token JWT
│   │   │   ├── empresaService.js   ← Chamadas à API REST
│   │   │   └── validacao.js        ← Validação dos formulários
│   │   ├── App.jsx                 ← Tela principal (tabela + busca)
│   │   ├── index.css               ← Estilos globais
│   │   └── index.js                ← Ponto de entrada
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf                  ← Proxy /empresas → backend
│
├── docker-compose.yml              ← Orquestra os 3 serviços
├── .gitignore
└── README.md
```

---

## Serviços e portas

| Serviço | URL | Descrição |
|---|---|---|
| Frontend | http://localhost:3000 | Interface React |
| Backend | http://localhost:8080 | API REST Spring Boot |
| PostgreSQL | localhost:5432 | Banco de dados |

Para conectar no banco com DBeaver ou pgAdmin:

| Campo | Valor |
|---|---|
| Host | localhost |
| Porta | 5432 |
| Banco | empresadb |
| Usuário | empresa_user |
| Senha | empresa_pass |

---

## Endpoints da API

Todos os endpoints abaixo exigem o header `Authorization: Bearer <token>`.
O token é obtido no login (`/auth/login` — único endpoint público).

| Método | Endpoint | Descrição |
|---|---|---|
| `POST`| `/auth/login` | Autenticação — retorna token JWT |
| `GET` | `/empresas` | Lista todas as empresas |
| `POST`| `/empresas` | Cadastra nova empresa |
| `GET` | `/empresas/{cnpj}` | Busca empresa por CNPJ |
| `PUT` | `/empresas/{cnpj}` | Atualiza empresa |
| `DELETE` | `/empresas/{cnpj}` | Remove empresa |
| `GET` | `/empresas/verificar?cnpj=` | Busca por CNPJ ou nome |

**Exemplo de login via curl:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Funcionalidades

- Tela de login com autenticação JWT — token válido por 24 horas
- Redirecionamento automático para login quando o token expira
- Cadastro de empresas com validação de CNPJ via BrasilAPI
- Preenchimento automático de endereço pelo CEP
- Busca por nome, CNPJ ou cidade
- Edição e exclusão de registros com confirmação
- Validação de campos no frontend e no backend
- Tratamento de erros com mensagens claras
- Usuário admin criado automaticamente na inicialização

---

## Variáveis de ambiente

As variáveis abaixo são configuradas no `docker-compose.yml`. Troque os valores em produção.

| Variável | Padrão | Descrição |
|---|---|---|
| `JWT_SECRET` | `minha-chave-...` | Chave de assinatura dos tokens |
| `JWT_EXPIRATION_MS` | `86400000` | Validade do token (24h em ms) |
| `ADMIN_USERNAME` | `admin` | Usuário inicial criado na primeira execução |
| `ADMIN_PASSWORD` | `admin123` | Senha do usuário inicial |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/empresadb` | URL do banco |
| `SPRING_DATASOURCE_USERNAME` | `empresa_user` | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | `empresa_pass` | Senha do banco |

---

## Parar o sistema

```bash
# Para os containers (dados do banco são mantidos)
docker compose down

# Para os containers e apaga os dados do banco
docker compose down -v
```

---

## Desenvolvimento local sem Docker

**Backend:**
```bash
cd backend
# Certifique-se de ter PostgreSQL rodando localmente
# Configure as variáveis no application.properties
mvn spring-boot:run
```

**Frontend:**
```bash
cd empresa-frontend
npm install
npm start
# Abre em http://localhost:3000
# O proxy já está configurado para redirecionar chamadas para :8080
```
