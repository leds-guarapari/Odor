using Odor.Services;
using OpenCage.Geocode;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class MapsPage : ContentPage
	{
        private readonly Geocoder Geocoder = new Geocoder(ConfigurationManager.Configuration.GeocoderApiKey);
        private readonly string Pattern = ConfigurationManager.Configuration.GeomapTilePattern;
        private readonly int Zoom = ConfigurationManager.Configuration.GeomapDefaultZoom;
        private readonly Models.Odor Odor;
        public string Tile { get; set; }
        public MapsPage (Models.Odor odor)
		{
			InitializeComponent ();
            this.Odor = odor;
            this.Address = odor.Address;
            this.Tile = string.Format(this.Pattern, this.Zoom, this.Odor.Latitude, this.Odor.Longitude);
            BindingContext = this;
        }
        private void WebViewNavigating(object sender, WebNavigatingEventArgs args)
        {
            IsBusy = true;
        }
        private void WebViewNavigated(object sender, WebNavigatedEventArgs args)
        {
            IsBusy = false;
            // Address = args.Url;
            // TODO Geocoder Api Client
        }
        private string address = string.Empty;
        public string Address
        {
            get { return address; }
            set
            {
                address = value;
                OnPropertyChanged();
            }
        }
        private bool isBusy = false;
        public new bool IsBusy
        {
            get { return isBusy; }
            set
            {
                isBusy = value;
                OnPropertyChanged();
            }
        }
    }
}