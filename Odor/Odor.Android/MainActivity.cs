using Android.App;
using Android.Content.PM;
using Android.OS;
using Xamarin.Forms;

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
            Forms.Init(this, bundle);
            FormsMaterial.Init(this, bundle);
            LoadApplication(new App());
        }
    }
}

