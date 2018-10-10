namespace Service_Manager_API.Models
{
    public class ServerMaster
    {
        /// <summary>
        /// Gets or sets the server identifier.
        /// </summary>
        /// <value>
        /// The server identifier.
        /// </value>
        public int ServerID { get; set; }

        /// <summary>
        /// Gets or sets the name of the server.
        /// </summary>
        /// <value>
        /// The name of the server.
        /// </value>
        public string ServerName { get; set; }
        /// <summary>
        /// Gets or sets the server ip.
        /// </summary>
        /// <value>
        /// The server ip.
        /// </value>
        public string ServerIP { get; set; }
        /// <summary>
        /// Gets or sets the name of the environment.
        /// </summary>
        /// <value>
        /// The name of the environment.
        /// </value>
        public string EnvironmentName { get; set; }
        /// <summary>
        /// Gets or sets the name of the server type.
        /// </summary>
        /// <value>
        /// The name of the server type.
        /// </value>
        public string ServerTypeName { get; set; }
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ServerMaster"/> is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if active; otherwise, <c>false</c>.
        /// </value>
        public bool Active { get; set; }
    }
}