using log4net;
using System;

namespace Service_Manager_API.Logging
{
    /// <summary>
    /// Enum LogLevel
    /// </summary>
    public enum LogLevel
    {
        /// <summary>
        /// The critical
        /// </summary>
        CRITICAL = 1,
        /// <summary>
        /// The error
        /// </summary>
        ERROR = 2,
        /// <summary>
        /// The warn
        /// </summary>
        WARN = 3,
        /// <summary>
        /// The information
        /// </summary>
        INFO = 4,
        /// <summary>
        /// The debug
        /// </summary>
        DEBUG = 5,
        /// <summary>
        /// All
        /// </summary>
        ALL = 6,

    };
    public class Logger
    {
        private static ILog logger = null;
        public Logger()
        {
            logger = LogManager.GetLogger("Default");
            log4net.Config.XmlConfigurator.Configure();
        }
        /// <summary>
        /// Logs the event.
        /// </summary>
        /// <param name="logLevel">The log level.</param>
        /// <param name="Description">The description.</param>
        public static void logEvent(LogLevel logLevel, string Description)
        {
            try
            {
                logger.Info(logLevel + " : " + Description);

            }
            catch (Exception ex)
            {

            }
            finally
            {

            }
        }
    }
}