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
            catch(Exception e)
            {
                Logger.logEvent(LogLevel.ERROR, "error in servicerepository.UploadCSV_ServerNames --> " + e.Message);
                Result = e.Message;
            }

            return Result;
        }

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
                                                Publisher = subkey.GetValue("Publisher").ToString()
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
    }
}