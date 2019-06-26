using Autofac;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using Xamarin.Essentials;
using Module = Autofac.Module;

namespace Odor.Services
{
    public interface IConfiguration
    {
        string Organization { get; set; }
        string UserFile { get; set; }
        string FirebaseRealtimeDatabasePath { get; set; }
        string GeomapTilePattern { get; set; }
        string GeomapTileMatch { get; set; }
        int GeomapDefaultZoom { get; set; }
        string OdorIntensity { get; set; }
        string OdorType { get; set; }
        double OdorLatitude { get; set; }
        double OdorLongitude { get; set; }
        string OdorAddress { get; set; }
    }
    public class Configuration : IConfiguration
    {
        [JsonConstructor]
        public Configuration() { }
        public string Organization { get; set; }
        public string UserFile { get; set; }
        public string FirebaseRealtimeDatabasePath { get; set; }
        public string GeomapTilePattern { get; set; }
        public string GeomapTileMatch { get; set; }
        public int GeomapDefaultZoom { get; set; }
        public string OdorIntensity { get; set; }
        public string OdorType { get; set; }
        public double OdorLatitude { get; set; }
        public double OdorLongitude { get; set; }
        public string OdorAddress { get; set; }
    }
    public class ConfigurationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            try
            {
                string name = Assembly.GetAssembly(typeof(IConfiguration)).GetTypes().FirstOrDefault(config => config.Name == nameof(IConfiguration))?.Namespace;
                Stream stream = Assembly.GetAssembly(typeof(IConfiguration)).GetManifestResourceStream($"{name}.config.json") ?? new MemoryStream();
                using (StreamReader reader = new StreamReader(stream))
                {
                    Configuration configuration = JsonConvert.DeserializeObject<Configuration>(reader.ReadToEnd()) ?? new Configuration();
                    builder.Register<IConfiguration>(register => configuration).SingleInstance();
                }
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
        }
    }
    public class LocationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            try
            {
                builder.Register<Location>(register => Geolocation.GetLastKnownLocationAsync().Result).SingleInstance();
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
        }
    }
    public class ConfigurationManager
    {
        public static IContainer Container { get; set; }
        private static IConfiguration configuration;
        public static IConfiguration Configuration
        {
            get
            {
                if (configuration == null)
                {
                    try
                    {
                        configuration = Container.Resolve<IConfiguration>();
                    }
                    catch (Exception exception)
                    {
                        Debug.WriteLine(exception);
                        configuration = new Configuration();
                    }
                }
                return configuration;
            }
        }
        private static Location location;
        public static Location Location
        {
            get
            {
                if (location == null)
                {
                    location = new Location();
                    try
                    {
                        double latitude = Configuration.OdorLatitude;
                        double longitude = Configuration.OdorLongitude;
                        location = new Location(latitude, longitude);
                    }
                    catch (Exception exception)
                    {
                        Debug.WriteLine(exception);
                    }
                    try
                    {
                        location = Container.Resolve<Location>();
                    }
                    catch (Exception exception)
                    {
                        Debug.WriteLine(exception);
                    }
                }
                return location;
            }
        }
    }
}