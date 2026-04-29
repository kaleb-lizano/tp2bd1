USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_ActualizarEmpleado]
    @inValorDocumentoActual VARCHAR(16)
    , @inValorDocumentoNuevo VARCHAR(16)
    , @inNombreNuevo VARCHAR(128)
    , @inNombrePuesto VARCHAR(128)
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (
            SELECT 1
            FROM [dbo].[Empleado] AS E
            WHERE (
                (E.[ValorDocumentoIdentidad] = @inValorDocumentoNuevo)
                AND (E.[ValorDocumentoIdentidad] != @inValorDocumentoActual)
            )
        )
        BEGIN
            SET @outResultCode = 50006;
            RETURN;
        END;

        IF EXISTS (
            SELECT 1
            FROM [dbo].[Empleado] AS E
            WHERE (
                (E.[Nombre] = @inNombreNuevo)
                AND (E.[ValorDocumentoIdentidad] != @inValorDocumentoActual)
            )
        )
        BEGIN
            SET @outResultCode = 50007;
            RETURN;
        END;

        BEGIN TRANSACTION
            UPDATE E
            SET
                E.[ValorDocumentoIdentidad] = @inValorDocumentoNuevo
                , E.[Nombre] = @inNombreNuevo
                , E.[IdPuesto] = (
                    SELECT P.[Id]
                    FROM [dbo].[Puesto] AS P
                    WHERE (P.[Nombre] = @inNombrePuesto)
                )
            FROM [dbo].[Empleado] AS E
            WHERE (E.[ValorDocumentoIdentidad] = @inValorDocumentoActual);
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

