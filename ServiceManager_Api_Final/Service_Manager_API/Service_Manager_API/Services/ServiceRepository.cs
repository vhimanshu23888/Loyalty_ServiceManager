using System;
using System.Collections.Generic;
using Service_Manager_API.Models;
using System.ServiceProcess;
using Service_Manager_API.Logging;
using Microsoft.Web.Administration;
using System.Linq;
using System.IO;
using System.Web;
using Microsoft.Win32;
using System.Globalization;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
namespace Service_Manager_API.Services
{
    public class ServiceRepository
    {

        /// <summary>
        /// The logger
        /// </summary>
        Logger _logger;
        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceRepository"/> class.
        /// </summary>
        public ServiceRepository()
        {
            _logger = new Logger();
        }
        /// <summary>
        /// Gets all services.
        /// </summary>
        /// <param name="MachineName">Name of the machine.</param>
        /// <returns></returns>
        public List<SystemService> GetAllServices(string MachineName)
        {
            Logger.logEvent(LogLevel.INFO, "Entered GetAllServices");
            List<SystemService> lstServices = new List<SystemService>();
            HashSet<string> MachineNameSet = new HashSet<string>();
            string[] _machineName = MachineName.Split(',');
            foreach (string machineName in _machineName)
            {
                try
                {
                    if (MachineNameSet.Contains(machineName.ToLower()))
                        continue;
                    else
                        MachineNameSet.Add(machineName.ToLower());
                    ServiceController[] Services = ServiceController.GetServices(machineName);
                    foreach (ServiceController service in Services)
                    {
                        lstServices.Add(
                            new SystemService
                            {
                                ServiceName = service.ServiceName,
                                ServiceStatus = service.Status.ToString(),
                                DisplayName = service.DisplayName,
                                MachineName = service.MachineName,
                                CanPauseAndContinue = service.CanPauseAndContinue,
                                CanShutdown = service.CanShutdown,
                                CanStop = service.CanStop,
                                StatusToBeUpdated = (int)service.Status,
                                IsWebService = false
                            });
                    }


                    ServerManager manager = ServerManager.OpenRemote(machineName);
                    SiteCollection sc = manager.Sites;
                    foreach (var site in sc)
                    {
                        lstServices.Add(
                            new SystemService
                            {
                                ServiceName = site.Name,
                                ServiceStatus = site.State.ToString(),
                                //ServiceStatus = ((ServiceControllerStatus)IIsEntity.Properties["ServerState"].Value).ToString(),
                                IsWebService = true,
                                MachineName = machineName
                            });
                    }
                }
                catch (System.Runtime.InteropServices.COMException ComException)
                {
                    Logger.logEvent(LogLevel.ERROR, "Authentication Failed --> user doesn't have enough permissions on server " + machineName + " Message --> " + ComException.Message);
                }
                catch (Exception ex)
                {
                    Logger.logEvent(LogLevel.ERROR, "error in servicerepository.getallservices inner try-catch block--> " + ex.Message);
                }

            }
            return lstServices;
        }

        /// <summary>
        /// Gets all services.
        /// </summary>
        /// <param name="MachineName">Name of the machine.</param>
        /// <returns></returns>
        public List<SystemService> GetAllConfiguredServices(string MachineName, string _Services)
        {
            Logger.logEvent(LogLevel.INFO, "Entered GetAllConfiguredServices");
            List<SystemService> lstServices = new List<SystemService>();
            HashSet<string> MachineNameSet = new HashSet<string>();
            HashSet<string> ServicesSet = new HashSet<string>();
            try
            {
                string[] _machineName = MachineName.Split(',');
                string[] SelectedServices = _Services.Split(',');
                foreach (string _service in SelectedServices)
                {
                    if (ServicesSet.Contains(_service.ToLower()))
                        continue;
                    else
                        ServicesSet.Add(_service.ToLower());
                }


                foreach (string machineName in _machineName)
                {
                    try
                    {
                        if (MachineNameSet.Contains(machineName.ToLower()))
                            continue;
                        else
                            MachineNameSet.Add(machineName.ToLower());
                        ServiceController[] Services = ServiceController.GetServices(machineName);
                        foreach (ServiceController service in Services)
                        {
                            if (ServicesSet.Contains(service.ServiceName.ToLower()) || ServicesSet.Contains(service.DisplayName.ToLower()))
                                lstServices.Add(
                                    new SystemService
                                    {
                                        ServiceName = service.ServiceName,
                                        ServiceStatus = service.Status.ToString(),
                                        DisplayName = service.DisplayName,
                                        MachineName = service.MachineName,
                                        CanPauseAndContinue = service.CanPauseAndContinue,
                                        CanShutdown = service.CanShutdown,
                                        CanStop = service.CanStop,
                                        StatusToBeUpdated = (int)service.Status,
                                        IsWebService = false
                                    });
                        }

                        ServerManager manager = ServerManager.OpenRemote(machineName);
                        foreach (var site in manager.Sites)
                        {
                            lstServices.Add(
                                new SystemService
                                {
                                    ServiceName = site.Name,
                                    ServiceStatus = site.State.ToString(),
                                    IsWebService = true,
                                    MachineName = machineName
                                });
                        }
                    }
                    catch (System.Runtime.InteropServices.COMException ComException)
                    {
                        Logger.logEvent(LogLevel.ERROR, "Authentication Failed --> user doesn't have enough permissions on server " + machineName + " Message --> " + ComException.Message);
                    }
                    catch (Exception ex)
                    {
                        Logger.logEvent(LogLevel.ERROR, "Error in ServiceRepository.GetAllConfiguredServices Inner Try-Catch Block --> " + ex.Message);
                    }

                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error in ServiceRepository.GetAllConfiguredServices --> " + ex.Message);
            }
            return lstServices;
        }

        /// <summary>
        /// Updates the service status.
        /// </summary>
        /// <param name="ServiceName">Name of the service.</param>
        /// <param name="MachineName">Name of the machine.</param>
        /// <param name="Status">The status.</param>
        /// <returns></returns>
        public ServiceResponse UpdateServiceStatus(string ServiceName, string MachineName, int Status, bool isWebService = false)
        {
            Logger.logEvent(LogLevel.INFO, "Entered UpdateServiceStatus");
            ServiceResponse objServiceResponse = new ServiceResponse();
            objServiceResponse.ServiceName = ServiceName;
            objServiceResponse.MacineName = MachineName;
            objServiceResponse.IsWebService = isWebService;
            objServiceResponse.Result = false;
            try
            {
                ServiceController _service = new ServiceController(ServiceName, MachineName);
                if (!isWebService)
                {
                    //if(_service)
                    switch (Status)
                    {
                        case 4:
                            if (_service.Status != ServiceControllerStatus.Running)
                                _service.Start();
                            objServiceResponse.Result = true;
                            break;
                        case 1:
                            if (_service.Status != ServiceControllerStatus.Stopped)
                                if (_service.CanStop)
                                {
                                    _service.Stop();
                                    objServiceResponse.Result = true;
                                }
                                else
                                {
                                    objServiceResponse.ErrorMessage = "Cannot Stop service, it is an Unstoppable Service";
                                    Logger.logEvent(LogLevel.ERROR, "Cannot Stop service, it is an Unstoppable Service --> " + _service.DisplayName);
                                }
                            break;
                        case 7:
                            if (_service.Status != ServiceControllerStatus.Paused)
                                if (_service.CanPauseAndContinue)
                                {
                                    _service.Pause();
                                    objServiceResponse.Result = true;
                                }
                                else
                                {
                                    objServiceResponse.ErrorMessage = "Cannot Pause service";
                                    Logger.logEvent(LogLevel.ERROR, "Cannot Pause service --> " + _service.DisplayName);
                                }
                            break;
                        case 10:
                            if (_service.CanStop)
                            {
                                _service.Stop();
                                _service.Start();
                                objServiceResponse.Result = true;
                            }
                            else
                            {
                                objServiceResponse.ErrorMessage = "Cannot Restart service, it is an Unstoppable Service";
                                Logger.logEvent(LogLevel.ERROR, "Cannot Restart service --> " + _service.DisplayName);
                            }
                            break;
                        default:
                            objServiceResponse.ErrorMessage = "Invalid Status Command";
                            Logger.logEvent(LogLevel.ERROR, "Error in ServiceRepository.UpdateServiceStatus --> " + "Invalid Status Command");
                            break;
                    }
                }
                else
                {

                    var server = ServerManager.OpenRemote(MachineName);
                    var site = server.Sites.FirstOrDefault(s => s.Name == ServiceName);
                    switch (Status)
                    {
                        case 4:
                            if (site.State != ObjectState.Started || site.State != ObjectState.Starting)
                                site.Start();
                            objServiceResponse.Result = true;
                            break;
                        case 1:
                        case 7:
                            if (site.State != ObjectState.Stopped || site.State != ObjectState.Stopping)
                            {
                                site.Stop();
                                objServiceResponse.Result = true;
                            }
                            break;
                        case 10:
                            site.Stop();
                            site.Start();
                            objServiceResponse.Result = true;
                            break;
                        default:
                            objServiceResponse.ErrorMessage = "Invalid Status Command";
                            Logger.logEvent(LogLevel.ERROR, "Error in ServiceRepository.UpdateServiceStatus --> " + "Invalid Status Command");
                            break;

                    }
                }
            }
            catch (Exception ex)
            {
                objServiceResponse.ErrorMessage = ex.Message;
                Logger.logEvent(LogLevel.ERROR, "Error in ServiceRepository.UpdateServiceStatus --> " + ex.Message);
                objServiceResponse.Result = false;
            }
            return objServiceResponse;
        }

        /// <summary>
        /// Uploads the CSV server names.
        /// </summary>
        /// <param name="MachineNames">The machine names.</param>
        /// <returns></returns>
        public string UploadCSV_ServerNames(string MachineNames)
        {
            Logger.logEvent(LogLevel.INFO, "Entered UploadCSV_ServerNames");
            string Result = string.Empty;
            string fullSavePath = string.Empty;
            try
            {
                fullSavePath = HttpContext.Current.Server.MapPath("~/App_Data/ServerNames.csv");
                Logger.logEvent(LogLevel.ERROR, "Upload Server Path:--> " + fullSavePath);
                File.WriteAllText(fullSavePath, MachineNames);
            }
            catch (Exception e)
            {
                Logger.logEvent(LogLevel.ERROR, "error in servicerepository.UploadCSV_ServerNames --> " + e.Message);
                Result = e.Message;
            }

            return Result;
        }

        /// <summary>
        /// Reads the versions.
        /// </summary>
        /// <param name="MachineName">Name of the machine.</param>
        /// <returns></returns>
        public List<InstalledAppDetails> ReadVersions(string MachineName)
        {
            Logger.logEvent(LogLevel.INFO, "Entered ReadVersions");
            List<InstalledAppDetails> lstApplications = new List<Models.InstalledAppDetails>();
            try
            {
                HashSet<string> MachineNameSet = new HashSet<string>();
                string[] _machineName = MachineName.Split(',');
                foreach (string machine in _machineName)
                {
                    if (MachineNameSet.Contains(machine.ToLower()) || string.IsNullOrEmpty(machine))
                        continue;
                    else
                        MachineNameSet.Add(machine.ToLower());

                    List<ServerMaster> LstServerDetails = GetServerMaster(ServerIP:machine);

                    string EnvironmentName = "NA", ServerTypeName = "NA";

                    if (LstServerDetails.Count > 0 && LstServerDetails[0] != null)
                    {
                        EnvironmentName = LstServerDetails[0].EnvironmentName;
                        ServerTypeName = LstServerDetails[0].ServerTypeName;
                    }
                    //Retrieve the list of installed programs for each extrapolated machine name
                    var registry_key = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";
                    using (Microsoft.Win32.RegistryKey key = RegistryKey.OpenRemoteBaseKey(RegistryHive.LocalMachine, machine).OpenSubKey(registry_key))
                    {
                        foreach (string subkey_name in key.GetSubKeyNames())
                        {
                            using (RegistryKey subkey = key.OpenSubKey(subkey_name))
                            {
                                try
                                {
                                    if (subkey.GetValue("DisplayName") != null && subkey.GetValue("Publisher").ToString().ToLower().Contains("aristocrat"))
                                    {
                                        lstApplications.Add(
                                            new InstalledAppDetails
                                            {
                                                MachineName = machine,
                                                ApplicationName = subkey.GetValue("DisplayName").ToString(),
                                                ApplicationVersion = subkey.GetValue("DisplayVersion").ToString(),
                                                InstalledDate = DateTime.ParseExact(subkey.GetValue("InstallDate")?.ToString(), "yyyyMMdd", CultureInfo.InvariantCulture).ToShortDateString(),
                                                Publisher = subkey.GetValue("Publisher").ToString(),
                                                EnvironmentName = EnvironmentName,
                                                ServerTypeName = ServerTypeName
                                            });
                                    }
                                }
                                catch (Exception ex)
                                {
                                    Logger.logEvent(LogLevel.ERROR, "Error Reading Application Details --> " + ex.Message);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Outer Exception --> " + ex.Message);
            }
            return lstApplications;
        }

        /// <summary>
        /// Inserts the environmnt master.
        /// </summary>
        /// <param name="objLstEnvironmentMaster">The object LST environment master.</param>
        /// <returns></returns>
        public string InsertEnvironmntMaster(EnvironmentMaster objEnvironmentMaster)
        {
            string Result = string.Empty;

            //foreach (EnvironmentMaster objEnvironmentMaster in objLstEnvironmentMaster)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                    {
                        con.Open();
                        SqlCommand cmd = new SqlCommand("dbo.USP_UC_X_EnvironmentMaster_Insert", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@EnvironmentName", objEnvironmentMaster.EnvironmentName);
                        cmd.Parameters.AddWithValue("@Active", objEnvironmentMaster.Active);
                        Result = ((int)cmd.ExecuteNonQuery() == 1) ? "Record Inserted Successfully for " + objEnvironmentMaster.EnvironmentName + "" : "Record Could not be Inserted for " + objEnvironmentMaster.EnvironmentName + "";
                        Logger.logEvent(LogLevel.INFO, "Insert EnvironmentMaster " + Result);
                    }
                }


                catch (Exception ex)
                {
                    Logger.logEvent(LogLevel.ERROR, "Error Inserting Environment Details for " + objEnvironmentMaster.EnvironmentName + " --> " + ex.Message);
                }
            }
            return Result;
        }

        /// <summary>
        /// Inserts the server type master.
        /// </summary>
        /// <param name="objServerTypeMaster">The object server type master.</param>
        /// <returns></returns>
        public string InsertServerTypeMaster(ServerTypeMaster objServerTypeMaster)
        {
            string Result = string.Empty;
            //foreach (ServerTypeMaster objServerTypeMaster in objLstServerTypeMaster)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                    {
                        con.Open();
                        SqlCommand cmd = new SqlCommand("dbo.USP_UC_X_ServerTypeMaster_Insert", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ServerTypeName", objServerTypeMaster.ServerTypeName);
                        cmd.Parameters.AddWithValue("@Active", objServerTypeMaster.Active);
                        Result = ((int)cmd.ExecuteNonQuery() == 1) ? "Record Inserted Successfully for ServerType " + objServerTypeMaster.ServerTypeName + " " : "Record Could not be Inserted for ServerType " + objServerTypeMaster.ServerTypeName + "";
                        Logger.logEvent(LogLevel.INFO, "Insert ServerTypeMaster " + Result);
                    }
                }
                catch (Exception ex)
                {
                    Logger.logEvent(LogLevel.ERROR, "Error Inserting ServerType Details for ServerType " + objServerTypeMaster.ServerTypeName + "  --> " + ex.Message);
                }
            }
            return Result;
        }

        /// <summary>
        /// Inserts the server master.
        /// </summary>
        /// <param name="objServerMaster">The object server master.</param>
        /// <returns></returns>
        public string InsertServerMaster(ServerMaster objServerMaster)
        {
            string Result = string.Empty;
            //foreach (ServerMaster objServerMaster in objLstServerMaster)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                    {
                        con.Open();
                        SqlCommand cmd = new SqlCommand("dbo.USP_UC_X_ServerMaster_Insert", con);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Server_IP", objServerMaster.ServerIP);
                        cmd.Parameters.AddWithValue("@ServerName", objServerMaster.ServerName);
                        cmd.Parameters.AddWithValue("@EnvironmentName", objServerMaster.EnvironmentName);
                        cmd.Parameters.AddWithValue("@ServerTypeName", objServerMaster.ServerTypeName);
                        cmd.Parameters.AddWithValue("@Active", objServerMaster.Active);
                        Result = ((int)cmd.ExecuteNonQuery() == 1) ? "Record Inserted Successfully for Server " + objServerMaster.ServerIP + " " : "Record Could not be Inserted for Server " + objServerMaster.ServerIP + "";
                    }
                }
                catch (Exception ex)
                {
                    Logger.logEvent(LogLevel.ERROR, "Error Inserting Server Details for Server " + objServerMaster.ServerIP + " --> " + ex.Message);
                }
            }
            return Result;
        }

        /// <summary>
        /// Gets the environment master.
        /// </summary>
        /// <param name="EnvironmentName">Name of the environment.</param>
        /// <returns></returns>
        public List<EnvironmentMaster> GetEnvironmentMaster (string EnvironmentName = null)
        {
            List<EnvironmentMaster> objLstEnvironmentMaster = new List<EnvironmentMaster>();
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("USP_UC_X_EnvironmentMaster_Get", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EnvironmentName", EnvironmentName);
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        objLstEnvironmentMaster.Add(
                            new EnvironmentMaster
                            {
                                EnvironmentID = (dr["EnvironmentID"] == null) ? -1 : Convert.ToInt32(dr["EnvironmentID"]),
                                EnvironmentName = (dr["EnvironmentName"] == null) ? string.Empty : dr["EnvironmentName"].ToString(),
                                Active = (dr["Active"] == null) ? false : Convert.ToBoolean(dr["Active"])
                            }
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error Fetching Environment Details --> " + ex.Message);
            }

            return objLstEnvironmentMaster;

        }

        /// <summary>
        /// Gets the server type master.
        /// </summary>
        /// <param name="ServerTypeName">Name of the server type.</param>
        /// <returns></returns>
        public List<ServerTypeMaster> GetServerTypeMaster(string ServerTypeName = null)
        {
            List<ServerTypeMaster> objLstServerTypeMaster = new List<ServerTypeMaster>();
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("USP_UC_X_ServerType_Get", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ServerTypeName", ServerTypeName);
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        objLstServerTypeMaster.Add(
                            new ServerTypeMaster
                            {
                                ID = (dr["ID"] == null) ? -1 : Convert.ToInt32(dr["ID"]),
                                ServerTypeName = (dr["ServerTypeName"] == null) ? string.Empty : dr["ServerTypeName"].ToString(),
                                Active = (dr["Active"] == null) ? false : Convert.ToBoolean(dr["Active"])
                            }
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error Fetching ServerType Details --> " + ex.Message);
            }

            return objLstServerTypeMaster;

        }

        /// <summary>
        /// Gets the server master.
        /// </summary>
        /// <param name="ServerName">Name of the server.</param>
        /// <param name="ServerIP">The server ip.</param>
        /// <param name="EnvironmentName">Name of the environment.</param>
        /// <param name="ServerTypeName">Name of the server type.</param>
        /// <returns></returns>
        public List<ServerMaster> GetServerMaster(string ServerName = null,string ServerIP = null,string EnvironmentName = null, string ServerTypeName = null)
        {
            List<ServerMaster> objLstServerMaster = new List<ServerMaster>();
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("USP_UC_X_Server_Get", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ServerName", ServerName);
                    cmd.Parameters.AddWithValue("@Server_IP", ServerIP);
                    cmd.Parameters.AddWithValue("@EnvironmentName", EnvironmentName);
                    cmd.Parameters.AddWithValue("@ServerTypeName", ServerTypeName);
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        objLstServerMaster.Add(
                            new ServerMaster
                            {
                                ServerID = (dr["ID"] == null) ? -1 : Convert.ToInt32(dr["ID"]),
                                ServerTypeName = (dr["ServerTypeName"] == null) ? string.Empty : dr["ServerTypeName"].ToString(),
                                Active = (dr["Active"] == null) ? false : Convert.ToBoolean(dr["Active"]),
                                EnvironmentName = (dr["EnvironmentName"] == null) ? string.Empty : dr["EnvironmentName"].ToString(),
                                ServerName = (dr["ServerName"] == null) ? string.Empty : dr["ServerName"].ToString(),
                                ServerIP = (dr["Server_IP"] == null) ? string.Empty : dr["Server_IP"].ToString()
                            }
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error Fetching Server Details --> " + ex.Message);
            }

            return objLstServerMaster;

        }

        /// <summary>
        /// Updates the environmnt master.
        /// </summary>
        /// <param name="objEnvironmentMaster">The object environment master.</param>
        /// <returns></returns>
        public string UpdateEnvironmntMaster(EnvironmentMaster objEnvironmentMaster)
        {
            string Result = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("dbo.USP_UC_X_EnvironmentMaster_Update", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", objEnvironmentMaster.EnvironmentID);
                    cmd.Parameters.AddWithValue("@EnvironmentName", objEnvironmentMaster.EnvironmentName);
                    cmd.Parameters.AddWithValue("@Active", objEnvironmentMaster.Active);
                    Result = ((int)cmd.ExecuteNonQuery() == 1) ? "Record Updated Successfully" : "Record Could not be Inserted";
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error Updating Environment Details --> " + ex.Message);
            }
            return Result;
        }

        /// <summary>
        /// Updates the server type master.
        /// </summary>
        /// <param name="objServerTypeMaster">The object server type master.</param>
        /// <returns></returns>
        public string UpdateServerTypeMaster(ServerTypeMaster objServerTypeMaster)
        {
            string Result = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("dbo.USP_UC_X_ServerTypeMaster_Update", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", objServerTypeMaster.ID);
                    cmd.Parameters.AddWithValue("@ServerTypeName", objServerTypeMaster.ServerTypeName);
                    cmd.Parameters.AddWithValue("@Active", objServerTypeMaster.Active);
                    Result = ((int)cmd.ExecuteNonQuery() == 1) ? "Record Inserted Successfully" : "Record Could not be Inserted";
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error Inserting ServerType Details --> " + ex.Message);
            }
            return Result;
        }

        /// <summary>
        /// Updates the server master.
        /// </summary>
        /// <param name="objServerMaster">The object server master.</param>
        /// <returns></returns>
        public string UpdateServerMaster(ServerMaster objServerMaster)
        {
            string Result = string.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ServiceManagerDBCon"].ToString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("dbo.USP_UC_X_ServerMaster_Update", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", objServerMaster.ServerID);
                    cmd.Parameters.AddWithValue("@Server_IP", objServerMaster.ServerIP);
                    cmd.Parameters.AddWithValue("@ServerName", objServerMaster.ServerName);
                    cmd.Parameters.AddWithValue("@EnvironmentName", objServerMaster.EnvironmentName);
                    cmd.Parameters.AddWithValue("@ServerTypeName", objServerMaster.ServerTypeName);
                    cmd.Parameters.AddWithValue("@Active", objServerMaster.Active);
                    Result = ((int)cmd.ExecuteNonQuery() == 1) ? "Record Inserted Successfully" : "Record Could not be Inserted";
                }
            }
            catch (Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error Inserting Server Details --> " + ex.Message);
            }
            return Result;
        }
    }
}