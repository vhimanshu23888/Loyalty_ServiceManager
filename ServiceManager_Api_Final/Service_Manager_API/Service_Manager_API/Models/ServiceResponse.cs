namespace Service_Manager_API.Models
{
    public class ServiceResponse
    {
        /// <summary>
        /// Gets or sets the name of the service.
        /// </summary>
        /// <value>
        /// The name of the service.
        /// </value>
        public string ServiceName { get; set; }
        /// <summary>
        /// Gets or sets the name of the macine.
        /// </summary>
        /// <value>
        /// The name of the macine.
        /// </value>
        public string MacineName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ServiceResponse"/> is result.
        /// </summary>
        /// <value>
        ///   <c>true</c> if result; otherwise, <c>false</c>.
        /// </value>
        public bool Result { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>
        /// The error message.
        /// </value>
        public string ErrorMessage { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is web service.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is web service; otherwise, <c>false</c>.
        /// </value>
        public bool IsWebService { get; set; }
    }
}