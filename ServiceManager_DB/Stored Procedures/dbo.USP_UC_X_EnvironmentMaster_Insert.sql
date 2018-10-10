IF OBJECT_ID('dbo.USP_UC_X_EnvironmentMaster_Insert') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_EnvironmentMaster_Insert;
GO

CREATE PROC dbo.USP_UC_X_EnvironmentMaster_Insert
(
  @EnvironmentName varchar(Max),
  @Active bit = 0
)
AS 
BEGIN
  --SET NOCOUNT ON
  IF NOT EXISTS (SELECT 1 FROM dbo.UC_X_EnvironmentMaster WHERE EnvironmentName = @EnvironmentName)
  INSERT INTO dbo.UC_X_EnvironmentMaster
  (
    EnvironmentName,
    Active
  )
  VALUES 
  (
    @EnvironmentName,
    @Active
  )
END
GO