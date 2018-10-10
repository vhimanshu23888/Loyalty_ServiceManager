IF OBJECT_ID('dbo.USP_UC_X_EnvironmentMaster_Get') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_EnvironmentMaster_Get;
GO

CREATE PROC dbo.USP_UC_X_EnvironmentMaster_Get
(
  @EnvironmentName varchar(Max) = NULL
)

AS 
BEGIN
  SET NOCOUNT ON

  SELECT
    EnvironmentID,
    EnvironmentName,
    Active
  FROM dbo.UC_X_EnvironmentMaster
  WHERE (@EnvironmentName IS NULL OR EnvironmentName = @EnvironmentName)
END
GO