export class ServiceResponse{
    /// <summary>
        /// Gets or sets the name of the service.
        /// </summary>
        /// <value>
        /// The name of the service.
        /// </value>
        ServiceName: string;
        /// <summary>
        /// Gets or sets the name of the macine.
        /// </summary>
        /// <value>
        /// The name of the macine.
        /// </value>
        MacineName: string;

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ServiceResponse"/> is result.
        /// </summary>
        /// <value>
        ///   <c>true</c> if result; otherwise, <c>false</c>.
        /// </value>
        Result: boolean;  

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>
        /// The error message.
        /// </value>
        ErrorMessage: string;

        /// <summary>
        /// Gets or sets a value indicating whether this instance is web service.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is web service; otherwise, <c>false</c>.
        /// </value>
        IsWebService:boolean;  
}