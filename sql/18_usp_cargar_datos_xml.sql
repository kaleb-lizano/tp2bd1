USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_CargarDatosXml]
    @inXml XML
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        INSERT [dbo].[Puesto]
        (
            [Nombre]
            , [SalarioxHora]
        )
        SELECT
            X.Y.value('@Nombre', 'VARCHAR(128)')
            , X.Y.value('@SalarioxHora', 'MONEY')
        FROM @inXml.nodes('/Datos/Puestos/Puesto') AS X(Y);

        SET IDENTITY_INSERT [dbo].[TipoEvento] ON;

        INSERT [dbo].[TipoEvento]
        (
            [Id]
            , [Nombre]
        )
        SELECT
            X.Y.value('@Id', 'INT')
            , X.Y.value('@Nombre', 'VARCHAR(128)')
        FROM @inXml.nodes('/Datos/TiposEvento/TipoEvento') AS X(Y);

        SET IDENTITY_INSERT [dbo].[TipoEvento] OFF;

        SET IDENTITY_INSERT [dbo].[TipoMovimiento] ON;

        INSERT [dbo].[TipoMovimiento]
        (
            [Id]
            , [Nombre]
            , [TipoAccion]
        )
        SELECT
            X.Y.value('@Id', 'INT')
            , X.Y.value('@Nombre', 'VARCHAR(128)')
            , X.Y.value('@TipoAccion', 'VARCHAR(128)')
        FROM @inXml.nodes('/Datos/TiposMovimientos/TipoMovimiento') AS X(Y);

        SET IDENTITY_INSERT [dbo].[TipoMovimiento] OFF;

        INSERT [dbo].[Error]
        (
            [Codigo]
            , [Descripcion]
        )
        SELECT
            X.Y.value('@Codigo', 'VARCHAR(8)')
            , X.Y.value('@Descripcion', 'VARCHAR(MAX)')
        FROM @inXml.nodes('/Datos/Error/error') AS X(Y);

        SET IDENTITY_INSERT [dbo].[Usuario] ON;

        INSERT [dbo].[Usuario]
        (
            [Id]
            , [Username]
            , [Password]
        )
        SELECT
            X.Y.value('@Id', 'INT')
            , X.Y.value('@Nombre', 'VARCHAR(128)')
            , X.Y.value('@Pass', 'VARCHAR(128)')
        FROM @inXml.nodes('/Datos/Usuarios/usuario') AS X(Y)
        WHERE NOT EXISTS (
            SELECT 1
            FROM [dbo].[Usuario] AS U
            WHERE (U.[Id] = X.Y.value('@Id', 'INT'))
        );

        SET IDENTITY_INSERT [dbo].[Usuario] OFF;

        INSERT [dbo].[Empleado]
        (
            [IdPuesto]
            , [ValorDocumentoIdentidad]
            , [Nombre]
            , [FechaContratacion]
            , [SaldoVacaciones]
            , [EsActivo]
        )
        SELECT
            (
                SELECT P.[Id]
                FROM [dbo].[Puesto] AS P
                WHERE (P.[Nombre] = X.Y.value('@Puesto', 'VARCHAR(128)'))
            )
            , X.Y.value('@ValorDocumentoIdentidad', 'VARCHAR(16)')
            , X.Y.value('@Nombre', 'VARCHAR(128)')
            , X.Y.value('@FechaContratacion', 'DATE')
            , 0
            , 1
        FROM @inXml.nodes('/Datos/Empleados/empleado') AS X(Y);

        SET @outResultCode = 0;
    END TRY
    BEGIN CATCH
        SET @outResultCode = 50008;

        INSERT INTO [dbo].[DBError]
        (
            [UserName], [Number], [State], [Severity]
            , [Line], [Procedure], [Message], [DateTime]
        )
        VALUES
        (
            SUSER_SNAME(), ERROR_NUMBER(), ERROR_STATE(), ERROR_SEVERITY()
            , ERROR_LINE(), ERROR_PROCEDURE(), ERROR_MESSAGE(), GETDATE()
        );
    END CATCH;
END;
GO
