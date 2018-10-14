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
  DECLARE 
    @EnvironmentID int =0,
    @ServerTypeID int =0;

    SELECT 
      @EnvironmentID = ISNULL(EnvironmentID,0)
    FROM dbo.UC_X_EnvironmentMaster
    WHERE EnvironmentName = @EnvironmentName;
    
    IF(@EnvironmentID = 0)
    RETURN 0;

    SELECT
      @ServerTypeID = ISNULL(ID,0)
    FROM dbo.UC_X_ServerTypeMaster
    WHERE ServerTypeName = @ServerTypeName;

    IF(@ServerTypeID = 0)
    RETURN 0;

  IF NOT EXISTS (SELECT 1 FROM dbo.UC_X_ServerMaster WHERE ServerName = @ServerName)
  INSERT INTO dbo.UC_X_ServerMaster
  (
    Server_IP,
    ServerName,
    EnvironmentID,
    ServerTypeID,
    Active
  )
  VALUES
  (
    @Server_IP,
    @ServerName,
    @EnvironmentID,
    @ServerTypeID,
    @Active
  )
END
GO