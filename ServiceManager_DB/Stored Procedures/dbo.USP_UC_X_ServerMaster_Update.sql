IF OBJECT_ID('dbo.USP_UC_X_ServerMaster_Update') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_ServerMaster_Update;
GO

CREATE PROC dbo.USP_UC_X_ServerMaster_Update
(
  @ID int,
  @Server_IP varchar(Max),
  @ServerName varchar(Max),
  @EnvironmentName varchar(Max),
  @ServerTypeName varchar(Max),
  @Active bit = 0
)
AS 
BEGIN
  SET NOCOUNT ON

  IF EXISTS (SELECT 1 FROM dbo.UC_X_ServerMaster WHERE ID = @ID AND Server_IP = @Server_IP)
  UPDATE SM SET 
    SM.ServerName = @ServerName,
    SM.EnvironmentID = EM.EnvironmentID,
    SM.ServerTypeID = STM.ID,
    SM.Active = @Active
    FROM dbo.UC_X_ServerMaster SM
    INNER JOIN dbo.UC_X_ServerTypeMaster STM  ON SM.ServerTypeID = STM.ID
    INNER JOIN dbo.UC_X_EnvironmentMaster EM ON SM.EnvironmentID = EM.EnvironmentID
  WHERE ( @ServerName IS NULL OR SM.ServerName = @ServerName)
    AND ( @Server_IP IS NULL OR SM.Server_IP = @Server_IP)
    AND ( @EnvironmentName IS NULL OR EM.EnvironmentName = @EnvironmentName)
    AND ( @ServerTypeName IS NULL OR STM.ServerTypeName = @ServerTypeName)
  ELSE IF NOT EXISTS(SELECT 1 FROM dbo.UC_X_ServerMaster WHERE Server_IP = @Server_IP)
    UPDATE SM SET 
      SM.Server_IP = @Server_IP,
      SM.ServerName = @ServerName,
      SM.EnvironmentID = EM.EnvironmentID,
      SM.ServerTypeID = STM.ID,
      SM.Active = @Active
    FROM dbo.UC_X_ServerMaster SM
      INNER JOIN dbo.UC_X_ServerTypeMaster STM  ON SM.ServerTypeID = STM.ID
      INNER JOIN dbo.UC_X_EnvironmentMaster EM ON SM.EnvironmentID = EM.EnvironmentID
    WHERE ( @ServerName IS NULL OR SM.ServerName = @ServerName)
      AND ( @Server_IP IS NULL OR SM.Server_IP = @Server_IP)
      AND ( @EnvironmentName IS NULL OR EM.EnvironmentName = @EnvironmentName)
      AND ( @ServerTypeName IS NULL OR STM.ServerTypeName = @ServerTypeName)
END
GO