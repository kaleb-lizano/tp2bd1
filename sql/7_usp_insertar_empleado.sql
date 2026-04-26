USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_InsertarEmpleado]
    @inValorDocumentoIdentidad VARCHAR(16)
    , @inNombre VARCHAR(128)
    , @inIdPuesto INT
    , @inFechaContratacion DATE
    , @inSaldoVacaciones FLOAT
    , @inEsActivo BIT
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (
            SELECT 1
            FROM [dbo].[Empleado] AS E
            WHERE (E.[ValorDocumentoIdentidad] = @inValorDocumentoIdentidad)
        )
        BEGIN
            SET @outResultCode = 50004;
            RETURN;
        END;

        IF EXISTS (
            SELECT 1
            FROM [dbo].[Empleado] AS E
            WHERE (E.[Nombre] = @inNombre)
        )
        BEGIN
            SET @outResultCode = 50005;
            RETURN;
        END;

        INSERT [dbo].[Empleado]
        (
            [IdPuesto]
            , [ValorDocumentoIdentidad]
            , [Nombre]
            , [FechaContratacion]
            , [SaldoVacaciones]
            , [EsActivo]
        )
        VALUES
        (
            @inIdPuesto
            , @inValorDocumentoIdentidad
            , @inNombre
            , @inFechaContratacion
            , @inSaldoVacaciones
            , @inEsActivo
        );

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
