# VetMate Backend (PHP puro + SQL Server) — Estrutura com pastas

**Sem framework**, organizado por **routes / controllers / repositories / middlewares / core** e com **JWT** e **CORS**.

```
vetmate-php-backend-psr/
├─ composer.json                 # (opcional) PSR-4; não há lib externa
├─ config/
│  ├─ config.php
│  └─ config.local.php           # (opcional) suas credenciais
├─ public/
│  ├─ index.php                  # front controller
│  └─ .htaccess                  # roteamento Apache
├─ routes/
│  └─ api.php                    # definição das rotas REST
├─ sql/
│  └─ schema.sql                 # tabelas
└─ src/
   ├─ Core/
   │  ├─ Autoload.php            # autoloader PSR-4 simples (se não usar composer)
   │  ├─ Request.php             # abstração da request
   │  ├─ Response.php            # helper JSON
   │  └─ Router.php              # roteador minimalista com params e middlewares
   ├─ Db/
   │  └─ SqlServer.php           # conexão sqlsrv e helpers
   ├─ Http/
   │  └─ Middleware/
   │     ├─ AuthMiddleware.php   # valida JWT e popula $req->user
   │     └─ CorsMiddleware.php   # CORS + OPTIONS
   ├─ Security/
   │  └─ Jwt.php                 # HS256 sign/verify
   ├─ Repositories/
   │  ├─ UsersRepository.php
   │  ├─ PetsRepository.php
   │  ├─ VetsRepository.php
   │  └─ AppointmentsRepository.php
   └─ Controllers/
      ├─ AuthController.php
      ├─ PetsController.php
      ├─ VetsController.php
      └─ AppointmentsController.php
```

## Endpoints
- `GET /api/health`
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`
- `GET /api/me` *(Bearer)*
- `GET /api/pets` *(Bearer)*
- `POST /api/pets` *(Bearer)*
- `PUT|PATCH /api/pets/:id` *(Bearer)*
- `DELETE /api/pets/:id` *(Bearer)*
- `GET /api/vets`
- `POST /api/vets` *(Bearer)*
- `PUT|DELETE /api/vets/:id` *(Bearer)*
- `GET /api/appointments` *(Bearer)*
- `POST /api/appointments` *(Bearer)*
- `PUT|DELETE /api/appointments/:id` *(Bearer)*

## Rodando
1. Execute `sql/schema.sql` no SSMS.
2. Copie `config/config.php` → `config/config.local.php` e ajuste credenciais e `jwt.secret`.
3. PHP embutido:
   ```bash
   php -S 0.0.0.0:8080 -t public
   ```
4. Teste `GET /api/health` e fluxo `register` → `login` (use o `token` nos demais).

> Dica: Se usar **Composer**, rode `composer dump-autoload` e você pode remover `src/Core/Autoload.php` e trocar o require do `vendor/autoload.php` no `public/index.php`.
