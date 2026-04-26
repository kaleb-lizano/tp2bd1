USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_ObtenerDescripcionError]
    @inCodigo VARCHAR(8)
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            E.[Descripcion]
        FROM [dbo].[Error] AS E
        WHERE (E.[Codigo] = @inCodigo);

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
