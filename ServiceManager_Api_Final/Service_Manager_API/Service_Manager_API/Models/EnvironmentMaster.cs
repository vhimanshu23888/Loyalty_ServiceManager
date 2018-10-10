namespace Service_Manager_API.Models
{
    public class EnvironmentMaster
    {
        /// <summary>
        /// Gets or sets the environment identifier.
        /// </summary>
        /// <value>
        /// The environment identifier.
        /// </value>
        public int EnvironmentID { get; set; }
        /// <summary>
        /// Gets or sets the name of the environment.
        /// </summary>
        /// <value>
        /// The name of the environment.
        /// </value>
        public string EnvironmentName { get; set; }
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="EnvironmentMaster"/> is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if active; otherwise, <c>false</c>.
        /// </value>
        public bool Active { get; set; }
    }
}