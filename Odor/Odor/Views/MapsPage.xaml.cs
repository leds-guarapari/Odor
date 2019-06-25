using Odor.Services;
using OpenCage.Geocode;
using System;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

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
        public string Tile { get; set; }
        public ICommand ConfirmCommand { get; private set; }
        public MapsPage(Models.Odor odor)
        {
            InitializeComponent();
            this.Odor = odor;
            this.Tile = string.Format(this.Pattern, this.Zoom, this.Odor.Latitude, this.Odor.Longitude);
            this.ConfirmCommand = new Command(async () => { await this.Dispatch(); });
            BindingContext = this;
        }
        async Task Dispatch()
        {
            if (!this.IsBusy)
            {
                this.IsBusy = true;
                await this.Confirm();
            }
        }
        async Task Confirm()
        {
            try
            {
                Regex expression = new Regex(this.Match);
                Match match = expression.Match(((UrlWebViewSource) Web.Source).Url);
                double latitude = double.Parse(match.Groups["C1"].Value);
                double longitude = double.Parse(match.Groups["C2"].Value);
                string language = ConfigurationManager.Configuration.GeomapResponseLanguage;
                await Task.Run(() =>
                {
                    GeocoderResponse response = this.Geocoder.ReverseGeocode(latitude, longitude, language);
                    Location location = response.Results.Last();
                    this.Odor.Latitude = latitude;
                    this.Odor.Longitude = longitude;
                    this.Odor.Location = location;
                    this.Odor.Address = location.Formatted ?? ConfigurationManager.Configuration.OdorAddress;
                });
                await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
                {
                    MessagingCenter.Send(this.Odor.Address, "Address");
                }));
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }            
            await Navigation.PopAsync();
        }
        private void WebViewNavigating(object sender, WebNavigatingEventArgs args)
        {
            this.IsBusy = true;
        }
        private void WebViewNavigated(object sender, WebNavigatedEventArgs args)
        {
            this.IsBusy = false;
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
    }
}