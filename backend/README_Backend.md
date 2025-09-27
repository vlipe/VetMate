
# 🐾 VetMate Backend - Guia de Instalação

Este guia ensina como rodar o backend do projeto **VetMate** no seu computador.  
O backend foi feito em **PHP** e usa **SQL Server** como banco de dados.

---

## ✅ Pré-requisitos

Antes de começar, já tenha instalados no seu PC (o coordenador já tem todos os instaladores prontos):
- [ ] **PHP 8.x (Thread Safe x64)** (já configurado com extensões `sqlsrv` e `pdo_sqlsrv`)
- [ ] **ODBC Driver 17 para SQL Server**
- [ ] **Microsoft Visual C++ Redistributable (x64)**
- [ ] **SQL Server Management Studio (SSMS)** + **SQL Server**

---

## 📂 Estrutura da Pasta

O backend já está configurado dentro da pasta:

```
C:\joao_escola\VetMate\backend
```

⚠️ Esse caminho pode mudar em cada PC.  
Basta abrir o **Prompt de Comando** ou **PowerShell**, navegar até a pasta correta e rodar os comandos.

---

## ▶️ Como Rodar o Servidor

1. Abra o **Prompt de Comando** ou **PowerShell**
2. Vá até a pasta do backend (ajuste o caminho se for diferente no seu PC):

```powershell
cd C:\joao_escola\VetMate\backend
```

3. Inicie o servidor embutido do PHP na porta **8081**:

```powershell
php -S localhost:8081 -t public
```

Se tudo estiver certo, verá a mensagem:
```
PHP Development Server (http://localhost:8081) started
```

---

## 🗄️ Banco de Dados

1. Abra o **SQL Server Management Studio (SSMS)**
2. Conecte ao servidor local (`localhost`, porta **1433**)
3. Crie o banco `VetMate` e execute os scripts SQL fornecidos para criar as tabelas.

---

## 🌐 Testando a API

Depois de rodar o servidor, você pode acessar no navegador ou no Insomnia:

- Testar se está online:
```
http://localhost:8081/api/health
```

Deve retornar algo como:
```json
{ "ok": true, "time": "2025-09-27T12:00:00-03:00" }
```

### Principais rotas disponíveis:

- **Auth**
  - `POST /api/auth/register` → cadastro de usuário
  - `POST /api/auth/login` → login de usuário

- **Pets**
  - `GET /api/pets` → lista pets do usuário logado
  - `POST /api/pets` → cadastra novo pet
  - `PUT /api/pets/:id` → atualização completa
  - `PATCH /api/pets/:id` → atualização parcial
  - `DELETE /api/pets/:id` → remover pet

- **Vets**
  - `GET /api/vets` → lista veterinários
  - `POST /api/vets` → cadastra veterinário (precisa login)
  - `DELETE /api/vets/:id` → remove veterinário

- **Users**
  - `GET /api/users` → lista usuários (apenas admin)
  - `PUT /api/users/:id` → atualizar usuário
  - `DELETE /api/users/:id` → deletar usuário

- **Clinics**
  - `POST /api/clinics/register` → cadastro de clínica
  - `POST /api/clinics/login` → login da clínica

---

## 🎉 Pronto!
Se você seguiu os passos, já consegue rodar o backend do VetMate no seu PC 🚀

