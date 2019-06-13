using Android.App;
using Android.Content.PM;
using Android.OS;
using Parse;

namespace Odor.Droid
{
    [Activity(Label = "Odor", Icon = "@drawable/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        protected override void OnCreate(Bundle bundle)
        {
            TabLayoutResource = Resource.Layout.Tabbar;
            ToolbarResource = Resource.Layout.Toolbar;

            base.OnCreate(bundle);
                        
            // Back4App Initialization
            ParseClient.Initialize(new ParseClient.Configuration
            {
                ApplicationId = "zgls9IIOj4bC0TA18w32I5u5hLBFwmwty8MvNwC8",
                WindowsKey = "Pfm8qjNMd1eV1B0IIRjxeHRWkC5wR3QiMgx7Jufc",
                Server = "https://parseap.back4app.com"
            });

            // Save the current installation to Back4App
            ParseInstallation.CurrentInstallation.SaveAsync();

            global::Xamarin.Forms.Forms.Init(this, bundle);
            LoadApplication(new App());
        }
    }
}

