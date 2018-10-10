IF OBJECT_ID('dbo.USP_UC_X_ServerMaster_Insert') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_ServerMaster_Insert;
GO

CREATE PROC dbo.USP_UC_X_ServerMaster_Insert
(
  @Server_IP varchar(Max),
  @ServerName varchar(Max),
  @EnvironmentName varchar(Max),
  @ServerTypeName varchar(Max),
  @Active bit = 0
)
AS 
BEGIN
  --SET NOCOUNT ON
  IF NOT EXISTS (SELECT 1 FROM dbo.UC_X_ServerMaster WHERE ServerName = @ServerName)
  INSERT INTO dbo.UC_X_ServerMaster
  SELECT 
    @Server_IP,
    @ServerName,
    EM.EnvironmentID,
    STM.ID,
    @Active
  FROM dbo.UC_X_ServerMaster SM
    INNER JOIN dbo.UC_X_ServerTypeMaster STM  ON SM.ServerTypeID = STM.ID
    INNER JOIN dbo.UC_X_EnvironmentMaster EM ON SM.EnvironmentID = EM.EnvironmentID
  WHERE EM.EnvironmentName = @EnvironmentName
    AND STM.ServerTypeName = @ServerTypeName
END
GO