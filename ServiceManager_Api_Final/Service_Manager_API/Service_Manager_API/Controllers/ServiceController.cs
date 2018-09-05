using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Service_Manager_API.Models;
using Service_Manager_API.Services;
using System.Web.Http.Cors;
using System.Configuration;
using System.IO;
using System.Web;
using System;
using Service_Manager_API.Logging;

namespace Service_Manager_Api.Controllers
{
    [EnableCors(origins: "*",headers: "*",methods: "*")]
    public class ServiceController : ApiController
    {
        /// <summary>
        /// The service repository
        /// </summary>
        private ServiceRepository _serviceRepository;
        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceController"/> class.
        /// </summary>
        public ServiceController()
        {
            _serviceRepository = new ServiceRepository();
        }

        // GET: api/Service
        /// <summary>
        /// Gets the specified machine name.
        /// </summary>
        /// <param name="MachineName">Name of the machine.</param>
        /// <returns></returns>
        [HttpGet]
        public List<SystemService> GetAllServicesByMachineName(string MachineName)
        {
            return _serviceRepository.GetAllServices(MachineName);
        }
        /// <summary>
        /// Uploads the machine names.
        /// </summary>
        /// <param name="MachineNames">The machine names.</param>
        /// <returns></returns>
        [HttpPut]
        public string PutUploadMachineNames([FromUri]string CSVData)
        {
            return _serviceRepository.UploadCSV_ServerNames(CSVData);
        }
        /// <summary>
        /// Gets the name of the service by.
        /// </summary>
        /// <param name="MachineName">Name of the machine.</param>
        /// <param name="ServiceName">Name of the service.</param>
        /// <returns></returns>
        [HttpGet]
        public List<SystemService> GetServiceByName([FromUri]string MachineName, [FromUri]string ServiceName)
        {
            IEnumerable<SystemService> result = new List<SystemService>();
            if (ServiceName.Contains("*"))
                result = _serviceRepository.GetAllServices(MachineName);
            else
                result = _serviceRepository.GetAllServices(MachineName).Select(X => X).Where(X=> X.ServiceName.Contains(ServiceName) || X.DisplayName.Contains(ServiceName));
            return result.ToList();
        }

        /// <summary>
        /// Gets the name of the service by.
        /// </summary>
        /// <param name="MachineName">Name of the machine.</param>
        /// <param name="ServiceName">Name of the service.</param>
        /// <returns></returns>
        [HttpGet]
        public List<SystemService> GetServiceByName([FromUri]string ServiceName)
        {
            IEnumerable<SystemService> result = new List<SystemService>();
            var dataFile = HttpContext.Current.Server.MapPath("~/App_Data/ServerNames.csv");
            string MachineName = string.Empty;
            if (File.Exists(dataFile))
            {
                MachineName = File.ReadAllText(dataFile);
            }
            else if(!string.IsNullOrEmpty(ConfigurationManager.AppSettings["MachineNames"].ToString()))
            {
                MachineName = ConfigurationManager.AppSettings["MachineNames"].ToString();
            }
            else
            {
                MachineName = "localhost";
            }
            if (!string.IsNullOrEmpty(MachineName))
                if (ServiceName.Contains("*"))
                    result = _serviceRepository.GetAllServices(MachineName);
                else
                    result = _serviceRepository.GetAllServices(MachineName).Select(X => X).Where(X => X.ServiceName.Contains(ServiceName) || X.DisplayName.Contains(ServiceName));
            return result.ToList();
        }

        
        [HttpGet]
        public List<SystemService> GetConfiguredServices()
        {

            var dataFile = HttpContext.Current.Server.MapPath("~/App_Data/ServerNames.csv");
            string MachineName = string.Empty;
            if (File.Exists(dataFile))
            {
                MachineName = File.ReadAllText(dataFile);
            }
            else
            {
                MachineName= ConfigurationManager.AppSettings["MachineNames"].ToString();
            }
            List<SystemService> result = new List<SystemService>();
            List<SystemService> finalResult = new List<SystemService>();
            string ServiceName = ConfigurationManager.AppSettings["Services"].ToString();
            if (!string.IsNullOrEmpty(MachineName) && !string.IsNullOrEmpty(ServiceName))
            {
                result = _serviceRepository.GetAllServices(MachineName);
                foreach (string services in ServiceName.Split(','))
                {
                    List<SystemService> service = result.Select(X => X).Where(X => (!string.IsNullOrEmpty(X.ServiceName) && X.ServiceName.Contains(services)) ||(!string.IsNullOrEmpty(X.DisplayName) && X.DisplayName.Contains(services))).Cast<SystemService>().ToList();
                    if (service != null)
                        finalResult.AddRange(service);
                }

            }
            return finalResult;
        }
        //// PUT: api/Service/5
        /// <summary>
        /// Puts the specified services.
        /// </summary>
        /// <param name="Services">The services.</param>
        /// <returns></returns>
        [HttpPut]
        public List<ServiceResponse> PutUpdateServiceStatus([FromBody]SystemService[] Services)
        {
            List<ServiceResponse> objServiceResponseList = new List<ServiceResponse>();
            foreach (SystemService Service in Services)
            {
                objServiceResponseList.Add(_serviceRepository.UpdateServiceStatus(Service.ServiceName, Service.MachineName, Service.StatusToBeUpdated, Service.IsWebService));

            }
            return objServiceResponseList;
        }

        /// <summary>
        /// Gets the environment details.
        /// </summary>
        /// <param name="ServerName">Name of the server.</param>
        /// <returns></returns>
        [HttpGet]
        public List<InstalledAppDetails> GetEnvironmentDetails(string ServerName)
        {
            List<InstalledAppDetails> result = new List<InstalledAppDetails>();
            var dataFile = HttpContext.Current.Server.MapPath("~/App_Data/ServerNames.csv");
            string MachineName = string.Empty;
            if (File.Exists(dataFile))
            {
                MachineName = File.ReadAllText(dataFile);
            }
            else if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["MachineNames"].ToString()))
            {
                MachineName = ConfigurationManager.AppSettings["MachineNames"].ToString();
            }
            else
            {
                MachineName = "localhost";
            }
            result = _serviceRepository.ReadVersions(MachineName);
            return result;
        }

        [HttpGet]
        public string GetLogs()
        {
            string log = string.Empty;
            try
            {
                var dataFile = HttpContext.Current.Server.MapPath("~/ServiceManagerLog.txt");
                if (File.Exists(dataFile))
                {
                    log = File.ReadAllText(dataFile);
                }
                else
                {
                    log = "Log file not found.";
                }
            }
            catch(Exception ex)
            {
                log = "Error Reading Log File.";
                Logger.logEvent(LogLevel.ERROR, "Error in ServiceController.UpdateServiceStatus --> " + ex.Message);
            }
            return log;

        }

        [HttpGet]
        public string GetServicesLogFile([FromUri]string MachineName, [FromUri]string ServiceName)
        {
            string fileContent = string.Empty;
            string line = string.Empty;
            try
            {
                string filename = "RewardsService.log";
                string path = @"\\172.28.70.45\RewardsService";
                StreamReader sr = new StreamReader(Path.Combine(path,filename));
                while ((line = sr.ReadLine()) != null) 
                    fileContent = fileContent + "\n" + line;
            }
            catch(Exception ex)
            {
                Logger.logEvent(LogLevel.ERROR, "Error in ServiceRepository.GetServicesLogFile --> " + ex.Message);
            }

            return fileContent;
        }
    }
}
