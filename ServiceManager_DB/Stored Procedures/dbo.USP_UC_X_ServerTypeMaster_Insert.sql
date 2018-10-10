IF OBJECT_ID('dbo.USP_UC_X_ServerTypeMaster_Insert') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_ServerTypeMaster_Insert;
GO

CREATE PROC dbo.USP_UC_X_ServerTypeMaster_Insert
(
  @ServerTypeName varchar(Max),
  @Active bit = 0
)
AS 
BEGIN
  --SET NOCOUNT ON
  IF NOT EXISTS (SELECT 1 FROM dbo.UC_X_ServerTypeMaster WHERE ServerTypeName = @ServerTypeName)
  INSERT INTO dbo.UC_X_ServerTypeMaster
  (
    ServerTypeName,
    Active
  )
  VALUES 
  (
    @ServerTypeName,
    @Active
  )
END
GO