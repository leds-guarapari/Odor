using Odor.Services;
using OpenCage.Geocode;
using System;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MapsPage : ContentPage
    {
        private readonly Models.Odor Odor;
        public ICommand ConfirmCommand { get; private set; }
        public MapsPage(Models.Odor odor)
        {
            InitializeComponent();
            this.Odor = new Models.Odor
            {
                Latitude = odor.Latitude,
                Longitude = odor.Longitude,
                Address = odor.Address,
                AdminArea = odor.AdminArea,
                CountryCode = odor.CountryCode,
                CountryName = odor.CountryName,
                FeatureName = odor.FeatureName,
                Locality = odor.Locality,
                PostalCode = odor.PostalCode,
                SubAdminArea = odor.SubAdminArea,
                SubLocality = odor.SubLocality,
                SubThoroughfare = odor.SubThoroughfare,
                Thoroughfare = odor.Thoroughfare
            };
            this.ConfirmCommand = new Command(async () => { await this.Dispatch(); });
            BindingContext = this;
        }
        protected override void OnAppearing()
        {
            base.OnAppearing();
            Device.BeginInvokeOnMainThread(async() =>
            {
                if (this.Odor.Latitude == 0 && this.Odor.Longitude == 0)
                {
                    Xamarin.Essentials.Location location = await this.GetLocationAsync();
                    this.Odor.Latitude = location.Latitude;
                    this.Odor.Longitude = location.Longitude;
                }
                Web.Source = string.Format(ConfigurationManager.Configuration.MapSource, ConfigurationManager.Configuration.MapZoom, this.Odor.Latitude, this.Odor.Longitude);
            });
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
                Regex expression = new Regex(ConfigurationManager.Configuration.MapMatch);
                Match match = expression.Match(((UrlWebViewSource)Web.Source).Url);
                double latitude = double.Parse(match.Groups["C1"].Value);
                double longitude = double.Parse(match.Groups["C2"].Value);
                await Task.Run(() =>
                {
                    GeocoderResponse response = (new Geocoder(ConfigurationManager.Configuration.GeocoderApiKey)).ReverseGeocode(latitude, longitude, ConfigurationManager.Configuration.GeocoderResponseLanguage);
                    OpenCage.Geocode.Location location = response.Results.Last();
                    this.Odor.Latitude = latitude;
                    this.Odor.Longitude = longitude;
                    this.Odor.AdminArea = location.Components.State;
                    this.Odor.CountryCode = location.Components.CountryCode;
                    this.Odor.CountryName = location.Components.Country;
                    this.Odor.FeatureName = location.Components.Type;
                    this.Odor.Locality = location.Components.StateDistrict;
                    this.Odor.PostalCode = location.Components.Postcode;
                    this.Odor.SubAdminArea = location.Components.City;
                    this.Odor.SubLocality = location.Components.County;
                    this.Odor.SubThoroughfare = location.Components.BusStop;
                    this.Odor.Thoroughfare = location.Components.Road;
                    this.Odor.Address = location.Formatted;
                });
                await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
                {
                    MessagingCenter.Send(this.Odor, "MapsOdor");
                }));
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            await Navigation.PopAsync();
        }
        private Task<Xamarin.Essentials.Location> GetLocationAsync()
        {
            try
            {
                return Geolocation.GetLocationAsync(new GeolocationRequest(GeolocationAccuracy.Medium));
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(new Xamarin.Essentials.Location(ConfigurationManager.Configuration.OdorLatitude, ConfigurationManager.Configuration.OdorLongitude));
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
                OnPropertyChanged("IsBusy");
            }
        }
    }
}