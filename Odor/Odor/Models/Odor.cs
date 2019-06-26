using System;

namespace Odor.Models
{
    public class Odor
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Intensity { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public string AdminArea { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string FeatureName { get; set; }
        public string Locality { get; set; }
        public string PostalCode { get; set; }
        public string SubAdminArea { get; set; }
        public string SubLocality { get; set; }
        public string SubThoroughfare { get; set; }
        public string Thoroughfare { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Begin { get; set; }
        public TimeSpan End { get; set; }
    }
}