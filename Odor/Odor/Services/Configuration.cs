using Autofac;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using Module = Autofac.Module;

namespace Odor.Services
{
    /*
     *
     * Default configuration interface data.
     * 
     */
    /// <summary>
    /// Default configuration interface data.
    /// </summary>
    public interface IConfiguration
    {
        string Organization { get; set; }
        string UserFile { get; set; }
        string FirebaseRealtimeDatabasePath { get; set; }
        string FirebaseAPIKey { get; set; }
        string FirebaseUser { get; set; }
        string FirebasePassword { get; set; }
        string OdorIntensity { get; set; }
        string OdorType { get; set; }
        string OdorAddress { get; set; }
        string LocalizedAddress { get; set; }
        string LocalizingAddress { get; set; }
    }
    /*
     *
     * Default configuration class data that implements interface.
     * 
     */
    /// <summary>
    /// Default configuration class data that implements interface.
    /// </summary>
    public class Configuration : IConfiguration
    {
        [JsonConstructor]
        public Configuration() { }
        public string Organization { get; set; }
        public string UserFile { get; set; }
        public string FirebaseRealtimeDatabasePath { get; set; }
        public string FirebaseAPIKey { get; set; }
        public string FirebaseUser { get; set; }
        public string FirebasePassword { get; set; }
        public string OdorIntensity { get; set; }
        public string OdorType { get; set; }
        public string OdorAddress { get; set; }
        public string LocalizedAddress { get; set; }
        public string LocalizingAddress { get; set; }
    }
    /*
     *
     * Default configuration module to perform injection.
     * 
     */
    /// <summary>
    /// Default configuration module to perform injection.
    /// </summary>
    public class ConfigurationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            try
            {
                // path name of configuration file
                string name = Assembly.GetAssembly(typeof(IConfiguration)).GetTypes().FirstOrDefault(config => config.Name == nameof(IConfiguration))?.Namespace;
                // stream of configuration file or memory
                Stream stream = Assembly.GetAssembly(typeof(IConfiguration)).GetManifestResourceStream($"{name}.config.json") ?? new MemoryStream();
                // using reader stream
                using (StreamReader reader = new StreamReader(stream))
                {
                    // convert file to configuration
                    Configuration configuration = JsonConvert.DeserializeObject<Configuration>(reader.ReadToEnd()) ?? new Configuration();
                    // register configuration
                    builder.Register<IConfiguration>(register => configuration).SingleInstance();
                }
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
        }
    }
    /*
     *
     * Default configuration manager to single instance.
     * 
     */
    /// <summary>
    /// Default configuration manager to single instance.
    /// </summary>
    public class ConfigurationManager
    {
        public static IContainer Container { get; set; }
        private static IConfiguration configuration;
        /// <returns>
        /// The default configuration.
        /// </returns>
        public static IConfiguration Configuration
        {
            get
            {
                // verify if configuration is valid
                if (configuration == null)
                {
                    try
                    {
                        // set configuration by injection
                        configuration = Container.Resolve<IConfiguration>();
                    }
                    catch (Exception exception)
                    {
                        Debug.WriteLine(exception);
                        // create empty configuration
                        configuration = new Configuration();
                    }
                }
                return configuration;
            }
        }
    }
}