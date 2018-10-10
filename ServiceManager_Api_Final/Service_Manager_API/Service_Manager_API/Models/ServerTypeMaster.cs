namespace Service_Manager_API.Models
{
    public class ServerTypeMaster
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int ID { get; set; }
        /// <summary>
        /// Gets or sets the name of the server type.
        /// </summary>
        /// <value>
        /// The name of the server type.
        /// </value>
        public string ServerTypeName { get; set; }
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ServerTypeMaster"/> is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if active; otherwise, <c>false</c>.
        /// </value>
        public bool Active { get; set; }
   }
}