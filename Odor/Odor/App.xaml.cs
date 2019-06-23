using Autofac;
using Odor.Services;
using Odor.Views;
using Xamarin.Forms;

namespace Odor
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
            ContainerBuilder builder = new ContainerBuilder();
            builder.RegisterModule(new ConfigurationModule());
            builder.RegisterModule(new LocationModule());
            ConfigurationManager.Container = builder.Build();
            MainPage = new MenuPage();
        }
        protected override void OnStart()
        {
            // Handle when your app starts
        }
        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }
        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}