using System;
using System.Collections.Generic;
using System.Text;

namespace Odor.Models
{
    public class Odor
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Type { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
    }
}
