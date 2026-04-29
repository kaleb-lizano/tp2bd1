USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_InsertarMovimiento]
    @inValorDocumentoIdentidad VARCHAR(16)
    , @inNombreTipoMovimiento VARCHAR(128)
    , @inFecha DATE
    , @inMonto FLOAT
    , @inNuevoSaldo FLOAT
    , @inPostByUser VARCHAR(128)
    , @inPostInIP VARCHAR(128)
    , @inPostTime DATETIME
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION
            INSERT [dbo].[Movimiento]
            (
                [IdEmpleado]
                , [IdTipoMovimiento]
                , [Fecha]
                , [Monto]
                , [NuevoSaldo]
                , [IdPostByUser]
                , [PostInIP]
                , [PostTime]
            )
            VALUES
            (
                (
                    SELECT E.[Id]
                    FROM [dbo].[Empleado] AS E
                    WHERE (E.[ValorDocumentoIdentidad] = @inValorDocumentoIdentidad)
                )
                , (
                    SELECT TM.[Id]
                    FROM [dbo].[TipoMovimiento] AS TM
                    WHERE (TM.[Nombre] = @inNombreTipoMovimiento)
                )
                , @inFecha
                , @inMonto
                , @inNuevoSaldo
                , (
                    SELECT U.[Id]
                    FROM [dbo].[Usuario] AS U
                    WHERE (U.[Username] = @inPostByUser)
                )
                , @inPostInIP
                , @inPostTime
            );

            UPDATE E
            SET E.[SaldoVacaciones] = @inNuevoSaldo
            FROM [dbo].[Empleado] AS E
            WHERE (E.[ValorDocumentoIdentidad] = @inValorDocumentoIdentidad);
        COMMIT;

        SET @outResultCode = 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

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

