USE [TareaProgramadaDos];
GO

CREATE TABLE [dbo].[Puesto]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [Nombre] VARCHAR(128) NOT NULL
	, [SalarioxHora] MONEY NOT NULL
);
GO

CREATE TABLE [dbo].[Empleado]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [IdPuesto] INT NOT NULL
	, [ValorDocumentoIdentidad] VARCHAR(16) NOT NULL
	, [Nombre] VARCHAR(128) NOT NULL
	, [FechaContratacion] DATE NOT NULL
	, [SaldoVacaciones] DECIMAL(4,2) NOT NULL
	, [EsActivo] BIT NOT NULL
	, CONSTRAINT [FK_Empleado_Puesto]
		FOREIGN KEY ([IdPuesto])
		REFERENCES [dbo].[Puesto]([Id])
);
GO

CREATE TABLE [dbo].[TipoMovimiento]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [Nombre] VARCHAR(128) NOT NULL
	, [TipoAccion] VARCHAR(128) NOT NULL
);
GO

CREATE TABLE [dbo].[Movimiento]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [IdEmpleado] INT NOT NULL
	, [IdTipoMovimiento] INT NOT NULL
	, [Fecha] DATE NOT NULL
	, [Monto] MONEY NOT NULL
	, [NuevoSaldo] MONEY NOT NULL
	, [IdPostByUser] INT NOT NULL
	, [PostInIP] VARCHAR(128) NOT NULL
	, [PostTime] DATETIME NOT NULL
	, CONSTRAINT [FK_Movimiento_Empleado]
		FOREIGN KEY ([IdEmpleado])
		REFERENCES [dbo].[Empleado]([Id])
	, CONSTRAINT [FK_Movimiento_TipoMovimiento]
		FOREIGN KEY ([IdTipoMovimiento])
		REFERENCES [dbo].[TipoMovimiento]([Id])
	, CONSTRAINT [FK_Movimiento_Usuario]
		FOREIGN KEY ([IdPostByUser])
		REFERENCES [dbo].[Usuario]([Id])
);
GO

CREATE TABLE [dbo].[Usuario]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [Username] VARCHAR(128) NOT NULL
	, [Password] VARCHAR(128) NOT NULL
);
GO

CREATE TABLE [dbo].[TipoEvento]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [Nombre] VARCHAR(128) NOT NULL
);
GO

CREATE TABLE [dbo].[BitacoraEvento]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [IdTipoEvento] INT NOT NULL
	, [Descripcion] VARCHAR(256) NOT NULL
	, [IdPostByUser] INT NOT NULL
	, [PostInIP] VARCHAR(128) NOT NULL
	, [PostTime] DATETIME NOT NULL
	, CONSTRAINT [FK_BitacoraEvento_TipoEvento]
		FOREIGN KEY ([IdTipoEvento])
		REFERENCES [dbo].[TipoEvento]([Id])
	, CONSTRAINT [FK_BitacoraEvento_Usuario]
		FOREIGN KEY ([IdPostByUser])
		REFERENCES [dbo].[Usuario]([Id])
);
GO

CREATE TABLE [dbo].[Error]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [Codigo] VARCHAR(8) NOT NULL
	, [Descripcion] VARCHAR(256) NOT NULL
);
GO

CREATE TABLE [dbo].[DBError]
(
	[Id] INT IDENTITY(1,1) PRIMARY KEY
	, [UserName] VARCHAR(128) NOT NULL
	, [Number] INT NOT NULL
	, [State] INT NOT NULL
	, [Severity] INT NOT NULL
	, [Line] INT NOT NULL
	, [Procedure] VARCHAR(128) NULL
	, [Message] VARCHAR(256) NOT NULL
	, [DateTime] DATETIME NOT NULL
);
GO