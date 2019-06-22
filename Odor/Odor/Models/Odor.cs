using OpenCage.Geocode;
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
        public Location Location { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Begin { get; set; }
        public TimeSpan End { get; set; }
    }
}