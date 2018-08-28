namespace Service_Manager_API.Models
{
    public class SystemService
    {
        /// <summary>
        /// Gets or sets the name of the service.
        /// </summary>
        /// <value>
        /// The name of the service.
        /// </value>
        public string ServiceName { get; set; }
        /// <summary>
        /// Gets or sets the service status.
        /// </summary>
        /// <value>
        /// The service status.
        /// </value>
        public string ServiceStatus { get; set; }
        /// <summary>
        /// Gets or sets the name of the machine.
        /// </summary>
        /// <value>
        /// The name of the machine.
        /// </value>
        public string MachineName { get; set; }
        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }
        /// <summary>
        /// Gets or sets the status to be updated.
        /// </summary>
        /// <value>
        /// The status to be updated.
        /// </value>
        public int StatusToBeUpdated { get; set; }
        /// <summary>
        /// Gets a value indicating whether this instance can pause and continue.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can pause and continue; otherwise, <c>false</c>.
        /// </value>
        public bool CanPauseAndContinue { get; set; }
        //
        // Summary:
        //     Gets a value indicating whether the service should be notified when the system
        //     is shutting down.
        //
        // Returns:
        //     true if the service should be notified when the system is shutting down; otherwise,
        //     false.
        /// <summary>
        /// Gets a value indicating whether this instance can shutdown.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can shutdown; otherwise, <c>false</c>.
        /// </value>
        public bool CanShutdown { get; set; }
        //
        // Summary:
        //     Gets a value indicating whether the service can be stopped after it has started.
        //
        // Returns:
        //     true if the service can be stopped and the System.ServiceProcess.ServiceBase.OnStop
        //     method called; otherwise, false.
        /// <summary>
        /// Gets a value indicating whether this instance can stop.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance can stop; otherwise, <c>false</c>.
        /// </value>
        public bool CanStop { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is web service.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is web service; otherwise, <c>false</c>.
        /// </value>
        public bool IsWebService { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>
        /// The error message.
        /// </value>
        public string ErrorMessage { get; set; }
    }
}