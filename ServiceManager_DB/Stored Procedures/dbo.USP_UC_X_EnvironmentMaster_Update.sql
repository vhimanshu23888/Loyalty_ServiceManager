IF OBJECT_ID('dbo.USP_UC_X_EnvironmentMaster_Update') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_EnvironmentMaster_Update;
GO

CREATE PROC dbo.USP_UC_X_EnvironmentMaster_Update
(
  @ID int,
  @EnvironmentName varchar(Max),
  @Active bit
)

AS 
BEGIN
  SET NOCOUNT ON
  IF EXISTS (SELECT 1 FROM dbo.UC_X_EnvironmentMaster WHERE EnvironmentID = @ID AND EnvironmentName = @EnvironmentName)
  UPDATE dbo.UC_X_EnvironmentMaster SET
    Active = @Active
  WHERE EnvironmentID = @ID
  ELSE IF NOT EXISTS (SELECT 1 FROM dbo.UC_X_EnvironmentMaster WHERE EnvironmentName = @EnvironmentName)
  UPDATE dbo.UC_X_EnvironmentMaster SET
    EnvironmentName = @EnvironmentName,
    Active = @Active
  WHERE EnvironmentID = @ID
END
GO