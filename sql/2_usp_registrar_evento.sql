USE [TareaProgramadaDos];
GO

CREATE PROCEDURE [dbo].[usp_RegistrarEvento]
    @inIdTipoEvento INT
    , @inDescripcion VARCHAR(MAX)
    , @inIdPostByUser INT
    , @inPostInIP VARCHAR(128)
    , @inPostTime DATETIME
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        INSERT INTO [dbo].[BitacoraEvento]
        (
            [IdTipoEvento]
            , [Descripcion]
            , [IdPostByUser]
            , [PostInIP]
            , [PostTime]
        )
        VALUES
        (
            @inIdTipoEvento
            , @inDescripcion
            , @inIdPostByUser
            , @inPostInIP
            , @inPostTime
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
    END CATCH
END
GO