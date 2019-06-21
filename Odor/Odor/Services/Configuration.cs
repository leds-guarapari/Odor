using Autofac;
using Module = Autofac.Module;
using Newtonsoft.Json;
using System.Reflection;
using System.IO;
using System.Linq;
using System;
using System.Diagnostics;

namespace Odor.Services
{
    public interface IConfiguration
    {
        string UserFile { get; set; }
        string FirebaseRealtimeDatabasePath { get; set; }
        string GeomapTilePattern { get; set; }
        int GeomapDefaultZoom { get; set; }
        string GeocoderApiKey { get; set; }
    }
    public class Configuration : IConfiguration
    {
        [JsonConstructor]
        public Configuration() { }
        public string UserFile { get; set; }
        public string FirebaseRealtimeDatabasePath { get; set; }
        public string GeomapTilePattern { get; set; }
        public int GeomapDefaultZoom { get; set; }
        public string GeocoderApiKey { get; set; }
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
    public class ConfigurationManager
    {
        private static Configuration configuration;
        public static Configuration Configuration {
            get
            {
                if (configuration ==  null)
                {
                    configuration = new Configuration();
                }
                return configuration;
            }
        }
    }
}