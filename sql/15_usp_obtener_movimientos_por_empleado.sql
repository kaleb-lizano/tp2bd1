USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_ObtenerMovimientosPorEmpleado]
    @inValorDocumentoIdentidad VARCHAR(16)
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            M.[Fecha]
            , TM.[Nombre] AS [NombreTipoMovimiento]
            , M.[Monto]
            , M.[NuevoSaldo]
            , U.[Username] AS [NombreUsuario]
            , M.[PostInIP]
            , M.[PostTime]
        FROM [dbo].[Movimiento] AS M
        INNER JOIN [dbo].[TipoMovimiento] AS TM
            ON (M.[IdTipoMovimiento] = TM.[Id])
        INNER JOIN [dbo].[Usuario] AS U
            ON (M.[IdPostByUser] = U.[Id])
        INNER JOIN [dbo].[Empleado] AS E
            ON (M.[IdEmpleado] = E.[Id])
        WHERE (E.[ValorDocumentoIdentidad] = @inValorDocumentoIdentidad)
        ORDER BY M.[Fecha] DESC;

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

