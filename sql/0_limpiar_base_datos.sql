USE [TareaProgramadaDos];
GO

DELETE FROM [dbo].[BitacoraEvento];
DELETE FROM [dbo].[Movimiento];
DELETE FROM [dbo].[DBError];
DELETE FROM [dbo].[Empleado];
DELETE FROM [dbo].[Usuario];
DELETE FROM [dbo].[Puesto];
DELETE FROM [dbo].[TipoMovimiento];
DELETE FROM [dbo].[TipoEvento];
DELETE FROM [dbo].[Error];
GO

DBCC CHECKIDENT ('[dbo].[BitacoraEvento]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Movimiento]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[DBError]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Empleado]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Usuario]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Puesto]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[TipoMovimiento]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[TipoEvento]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Error]', RESEED, 0);
GO
