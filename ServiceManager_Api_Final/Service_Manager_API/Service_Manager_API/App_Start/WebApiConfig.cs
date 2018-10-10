using System.Web.Http;
namespace Service_Manager_API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Web API routes

            config.EnableCors();
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
            name: "UploadCSV_ServerNames",
            routeTemplate: "api/{controller}/{action}/{CSVData}",
            defaults: new { CSVData = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "ParameterizedApi",
                routeTemplate: "api/{controller}/{action}/{ServiceName}/{MachineName}/{Status}",
                defaults:
                    new
                    {
                        ServiceName = RouteParameter.Optional,
                        MachineName = RouteParameter.Optional,
                        Status = RouteParameter.Optional
                    });

            config.Routes.MapHttpRoute(
                name: "GetServiceByNameApi",
                routeTemplate: "api/{controller}/{action}/{ServiceName}/{MachineName}",
                defaults:
                    new
                    {
                        ServiceName = RouteParameter.Optional,
                        MachineName = RouteParameter.Optional
                    });
            config.Routes.MapHttpRoute(
            name: "GetEnvironmentDetails",
            routeTemplate: "api/{controller}/{action}/{ServerName}",
            defaults: new { ServerName = RouteParameter.Optional });

            config.Routes.MapHttpRoute(
            name: "GetServicesByConfiguredMachines",
            routeTemplate: "api/{controller}/{action}/{ServiceName}",
            defaults: new { ServerName = RouteParameter.Optional });

            config.Routes.MapHttpRoute(
            name: "GetConfiguredServicesByConfiguredMachines",
            routeTemplate: "api/{controller}/{action}");

            config.Routes.MapHttpRoute(
            name: "GetServicesLogFile",
            routeTemplate: "api/{controller}/{action}/{MachineName}/{ServiceName}");

            config.Routes.MapHttpRoute(
            name: "GetAllServerDetails",
            routeTemplate: "api/{controller}/{action}/{ServerMasterName}",
            defaults: new
            {
                ServerMasterName = RouteParameter.Optional
            });

            config.Routes.MapHttpRoute(
            name: "GetAllServerTypes",
            routeTemplate: "api/{controller}/{action}/{ServerTypeName}",
            defaults: new
            {
                ServerTypeName = RouteParameter.Optional
            });

            config.Routes.MapHttpRoute(
            name: "GetAllEnvironmentNames",
            routeTemplate: "api/{controller}/{action}/{EnvironmentName}",
            defaults: new
            {
                EnvironmentName = RouteParameter.Optional
            });

            config.Routes.MapHttpRoute(
            name: "PutServerTypeMaster",
            routeTemplate: "api/{controller}/{action}");

            config.Routes.MapHttpRoute(
            name: "PutServerMaster",
            routeTemplate: "api/{controller}/{action}");

            config.Routes.MapHttpRoute(
            name: "PutEnvironmentMaster",
            routeTemplate: "api/{controller}/{action}");


            config.Routes.MapHttpRoute(
            name: "PostServerTypeMaster",
            routeTemplate: "api/{controller}/{action}");

            config.Routes.MapHttpRoute(
            name: "PostServerMaster",
            routeTemplate: "api/{controller}/{action}");

            config.Routes.MapHttpRoute(
            name: "PostEnvironmentMaster",
            routeTemplate: "api/{controller}/{action}");


            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{MachineName}",
                defaults: new { MachineName = RouteParameter.Optional });
        }
    }
}
