using System;

namespace Service_Manager_API.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class InstalledAppDetails
    {
        /// <summary>
        /// Gets or sets the name of the machine.
        /// </summary>
        /// <value>
        /// The name of the machine.
        /// </value>
        public string MachineName { get; set; }
        /// <summary>
        /// Gets or sets the name of the application.
        /// </summary>
        /// <value>
        /// The name of the application.
        /// </value>
        public string ApplicationName { get; set; }

        /// <summary>
        /// Gets or sets the application version.
        /// </summary>
        /// <value>
        /// The application version.
        /// </value>
        public string ApplicationVersion { get; set; }

        /// <summary>
        /// Gets or sets the installed date.
        /// </summary>
        /// <value>
        /// The installed date.
        /// </value>
        public string InstalledDate { get; set; }

        /// <summary>
        /// Gets or sets the publisher.
        /// </summary>
        /// <value>
        /// The publisher.
        /// </value>
        public string Publisher { get; set; }
    }
}