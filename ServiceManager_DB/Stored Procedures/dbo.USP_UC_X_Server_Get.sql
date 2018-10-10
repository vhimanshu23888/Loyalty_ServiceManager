IF OBJECT_ID('dbo.USP_UC_X_Server_Get') IS NOT NULL
  DROP PROCEDURE dbo.USP_UC_X_Server_Get;
GO

CREATE PROC dbo.USP_UC_X_Server_Get
(
  @ServerName varchar (MAX) = NULL,
  @Server_IP varchar(MAX) = NULL,
  @EnvironmentName varchar(MAX) = NULL,
  @ServerTypeName varchar(MAX) = NULL
)
AS
BEGIN
  SET NOCOUNT ON;

   SELECT 
    SM.ID,
    SM.Server_IP,
    SM.ServerName,
    EM.EnvironmentName,
    STM.ServerTypeName,
    SM.Active
  FROM dbo.UC_X_ServerMaster SM
    INNER JOIN dbo.UC_X_ServerTypeMaster STM  ON SM.ServerTypeID = STM.ID
    INNER JOIN dbo.UC_X_EnvironmentMaster EM ON SM.EnvironmentID = EM.EnvironmentID
  WHERE ( @ServerName IS NULL OR SM.ServerName = @ServerName)
    AND ( @Server_IP IS NULL OR SM.Server_IP = @Server_IP)
    AND ( @EnvironmentName IS NULL OR EM.EnvironmentName = @EnvironmentName)
    AND ( @ServerTypeName IS NULL OR STM.ServerTypeName = @ServerTypeName)
END;
GO