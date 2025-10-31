-- CREATE DATABASE VetMate; GO
-- USE VetMate; GO

IF OBJECT_ID('Users','U') IS NULL
CREATE TABLE Users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(120) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  password_hash NVARCHAR(255) NOT NULL,
  role NVARCHAR(50) NOT NULL DEFAULT 'user',
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('Pets','U') IS NULL
CREATE TABLE Pets (
  id INT IDENTITY(1,1) PRIMARY KEY,
  owner_id INT NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
  name NVARCHAR(120) NOT NULL,
  species NVARCHAR(60) NOT NULL,
  breed NVARCHAR(120) NULL,
  birthdate DATE NULL,
  notes NVARCHAR(1000) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('Vets','U') IS NULL
CREATE TABLE Vets (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(120) NOT NULL,
  crmvet NVARCHAR(60) NULL,
  specialty NVARCHAR(120) NULL,
  phone NVARCHAR(60) NULL,
  email NVARCHAR(255) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('Appointments','U') IS NULL
CREATE TABLE Appointments (
  id INT IDENTITY(1,1) PRIMARY KEY,
  pet_id INT NOT NULL FOREIGN KEY REFERENCES Pets(id) ON DELETE CASCADE,
  vet_id INT NULL FOREIGN KEY REFERENCES Vets(id) ON DELETE SET NULL,
  date_time DATETIME2 NOT NULL,
  reason NVARCHAR(500) NOT NULL,
  status NVARCHAR(40) NOT NULL DEFAULT 'scheduled',
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE INDEX IX_Pets_Owner ON Pets(owner_id);
CREATE INDEX IX_Appointments_Date ON Appointments(date_time);
GO


-- 3.1 habilitar o login sa
ALTER LOGIN sa ENABLE;

-- 3.2 definir uma senha forte para o sa
ALTER LOGIN sa WITH PASSWORD = 'SuaSenhaForte!123';

-- 3.3 (opcional, mas recomendado) forçar que o sa não expire
ALTER LOGIN sa WITH CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;



-- 4.1 criar o banco (se não existir)
IF DB_ID('VetMate') IS NULL
BEGIN
  CREATE DATABASE VetMate;
END
GO

USE VetMate;
GO

-- 4.2 criar um login dedicado (evita usar sa em produção)
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'vetmate_user')
BEGIN
  CREATE LOGIN vetmate_user WITH PASSWORD = 'SenhaFort3!'; -- defina a sua
END
GO

-- 4.3 criar usuário no banco e dar permissões
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'vetmate_user')
BEGIN
  CREATE USER vetmate_user FOR LOGIN vetmate_user;
END
GO

ALTER ROLE db_owner ADD MEMBER vetmate_user; -- simplifica; em prod, dê só o necessário
GO


ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'SuaSenhaForte!123';


USE VetMate;
GO

ALTER TABLE Pets ADD
  sex        NVARCHAR(10) NULL,        -- 'macho' | 'femea' (ou outro texto)
  weight_kg  DECIMAL(6,2) NULL,        -- peso em kg
  age_years  INT NULL,                 -- idade em anos
  size       NVARCHAR(20) NULL;        -- 'pequeno' | 'medio' | 'grande'
GO

UPDATE Users
SET role = 'admin'
WHERE email = 'teste@vet.com';


USE VetMate;
GO

IF OBJECT_ID('Clinics','U') IS NULL
CREATE TABLE Clinics (
  id               INT IDENTITY(1,1) PRIMARY KEY,
  cnpj             VARCHAR(14) NOT NULL UNIQUE,    -- só dígitos (sem máscara)
  corporate_name   NVARCHAR(200) NOT NULL,         -- razão social
  trade_name       NVARCHAR(200) NULL,             -- nome fantasia
  email            NVARCHAR(255) NOT NULL UNIQUE,
  phone            NVARCHAR(60)  NULL,
  password_hash    NVARCHAR(255) NOT NULL,
  -- endereço
  address_line1    NVARCHAR(200) NULL,
  address_line2    NVARCHAR(200) NULL,
  district         NVARCHAR(120) NULL,
  city             NVARCHAR(120) NULL,
  state            NVARCHAR(60)  NULL,
  zip_code         NVARCHAR(20)  NULL,
  -- extras
  opening_hours    NVARCHAR(400) NULL,             -- ex: "seg-sex 09:00-18:00"
  latitude         DECIMAL(9,6) NULL,
  longitude        DECIMAL(9,6) NULL,
  status           NVARCHAR(40) NOT NULL DEFAULT 'active',
  created_at       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE INDEX IX_Clinics_City ON Clinics(city);


USE VetMate;
GO

IF COL_LENGTH('Clinics', 'zip_code') IS NOT NULL
BEGIN
  EXEC sp_rename 'Clinics.zip_code', 'cep', 'COLUMN';
END
GO

-- ajuste o schema/tabela conforme o seu (ex.: dbo.Users)
ALTER TABLE Users
ADD avatar_url NVARCHAR(255) NULL;

GO


