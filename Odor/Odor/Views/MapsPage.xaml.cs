using Odor.Services;
using OpenCage.Geocode;
using System;
using System.Linq;
using System.Diagnostics;
using System.Text.RegularExpressions;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Odor.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class MapsPage : ContentPage
	{
        private readonly Geocoder Geocoder = new Geocoder(ConfigurationManager.Configuration.GeocoderApiKey);
        private readonly string Pattern = ConfigurationManager.Configuration.GeomapTilePattern;
        private readonly string Match = ConfigurationManager.Configuration.GeomapTileMatch;
        private readonly int Zoom = ConfigurationManager.Configuration.GeomapDefaultZoom;
        private readonly Models.Odor Odor;
        private readonly Models.Odor odor;
        public string Tile { get; set; }
        public ICommand SelectCommand { get; private set; }
        public MapsPage (Models.Odor odor)
		{
			InitializeComponent ();
            this.odor = odor;
            this.Odor = new Models.Odor {
                Latitude = odor.Latitude,
                Longitude = odor.Longitude,
                Address = odor.Address,
                Location = odor.Location
            };
            this.Address = this.Odor.Address;
            this.Tile = string.Format(this.Pattern, this.Zoom, this.Odor.Latitude, this.Odor.Longitude);
            SelectCommand = new Command(async () => { await this.Dispatch(); });
            BindingContext = this;
        }
        async Task Dispatch()
        {
            if (!this.IsBusy)
            {
                this.IsBusy = true;
                this.odor.Latitude = this.Odor.Latitude;
                this.odor.Longitude = this.Odor.Longitude;
                this.odor.Address = this.Odor.Address;
                this.odor.Location = this.Odor.Location;
                await Navigation.PopAsync();
            }
        }
        private string Url = string.Empty;
        private void WebViewNavigating(object sender, WebNavigatingEventArgs args)
        {
            this.IsBusy = true;
        }
        private void WebViewNavigated(object sender, WebNavigatedEventArgs args)
        {
            this.IsBusy = false;
            this.Url = args.Url;
        }
        
        private string address = string.Empty;
        public string Address
        {
            get { return this.address; }
            set
            {
                this.address = value;
                OnPropertyChanged();
            }
        }
        private bool isBusy = false;
        public new bool IsBusy
        {
            get { return this.isBusy; }
            set
            {
                this.isBusy = value;
                OnPropertyChanged();
            }
        }
        private async void OnButtonClicked(object sender, EventArgs args)
        {
            if (this.IsBusy)
            {
                return;
            }
            this.IsBusy = true;
            try
            {
                Regex expression = new Regex(this.Match);
                Match match = expression.Match(this.Url);
                double latitude = double.Parse(match.Groups["C1"].Value);
                double longitude = double.Parse(match.Groups["C2"].Value);
                string language = ConfigurationManager.Configuration.GeomapResponseLanguage;
                await Task.Run(() => {
                    GeocoderResponse response = this.Geocoder.ReverseGeocode(latitude, longitude, language);
                    Location location = response.Results.Last();
                    this.Odor.Location = location;
                    this.Odor.Latitude = latitude;
                    this.Odor.Longitude = longitude;
                    this.Address = this.Odor.Address = location?.Formatted ?? ConfigurationManager.Configuration.OdorAddress;
                });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            this.IsBusy = false;
        }
    }
}