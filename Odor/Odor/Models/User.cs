namespace Odor.Models
{
    /*
     *
     * Default user class data.
     * 
     */
    /// <summary>
    /// Default user class data.
    /// </summary>
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}