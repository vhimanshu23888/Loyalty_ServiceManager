IF OBJECT_ID('dbo.USP_UC_X_ServerType_Get') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_ServerType_Get;
GO

CREATE PROC dbo.USP_UC_X_ServerType_Get
(
  @ServerTypeName varchar (MAX) = NULL
)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT 
    ID, 
    ServerTypeName, 
    Active 
  FROM dbo.UC_X_ServerTypeMaster
  WHERE (@ServerTypeName IS NULL OR ServerTypeName = @ServerTypeName)

END;
GO