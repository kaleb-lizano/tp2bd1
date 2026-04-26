USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_EliminarEmpleado]
    @inValorDocumentoIdentidad VARCHAR(16)
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION
            UPDATE E
            SET E.[EsActivo] = 0
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

