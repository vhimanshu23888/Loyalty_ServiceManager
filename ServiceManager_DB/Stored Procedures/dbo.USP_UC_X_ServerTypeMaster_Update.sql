IF OBJECT_ID('dbo.USP_UC_X_ServerTypeMaster_Update') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_ServerTypeMaster_Update;
GO

CREATE PROC dbo.USP_UC_X_ServerTypeMaster_Update
(
  @ID int,
  @ServerTypeName varchar(Max),
  @Active bit
)
AS 
BEGIN
  SET NOCOUNT ON
  IF EXISTS (SELECT 1 FROM dbo.UC_X_ServerTypeMaster WHERE ID = @ID AND ServerTypeName = @ServerTypeName)
  UPDATE dbo.UC_X_ServerTypeMaster SET
    Active = @Active
  WHERE ID = @ID
  ELSE IF NOT EXISTS (SELECT 1 FROM dbo.UC_X_ServerTypeMaster WHERE ServerTypeName = @ServerTypeName)
  UPDATE dbo.UC_X_ServerTypeMaster SET
    ServerTypeName = @ServerTypeName,
    Active = @Active
  WHERE ID = @ID
END
GO