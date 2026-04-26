USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_FiltrarEmpleadosPorDocumento]
    @inFiltroDocumento VARCHAR(16)
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            E.[ValorDocumentoIdentidad]
            , E.[Nombre]
            , P.[Nombre] AS [NombrePuesto]
            , E.[SaldoVacaciones]
            , E.[EsActivo]
            , E.[FechaContratacion]
            , E.[IdPuesto]
        FROM [dbo].[Empleado] AS E
        INNER JOIN [dbo].[Puesto] AS P
            ON (E.[IdPuesto] = P.[Id])
        WHERE (E.[ValorDocumentoIdentidad] LIKE '%' + @inFiltroDocumento + '%')
        ORDER BY E.[Nombre] ASC;

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
