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

  IF EXISTS (SELECT 1 FROM dbo.UC_X_ServerMaster WHERE ID = @ID)
  UPDATE SM SET 
    SM.Server_IP = @Server_IP,
    SM.ServerName = @ServerName,
    SM.EnvironmentID = @EnvironmentID,
    SM.ServerTypeID = @ServerTypeID,
    SM.Active = @Active
    FROM dbo.UC_X_ServerMaster SM
  WHERE SM.ID = @ID
END
GO