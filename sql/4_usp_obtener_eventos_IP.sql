USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_ObtenerEventosPorIP]
    @inPostInIP VARCHAR(128)
    , @inIdTipoEvento INT
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            E.[PostTime]
            , E.[Descripcion]
        FROM [dbo].[BitacoraEvento] AS E
        WHERE (E.[PostInIP] = @inPostInIP)
            AND (E.[IdTipoEvento] = @inIdTipoEvento);

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
    END CATCH
END
GO
