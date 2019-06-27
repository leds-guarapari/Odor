using Odor.Services;
using System;
using System.Collections.Generic;
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
        private readonly string Pattern = ConfigurationManager.Configuration.GeomapTilePattern;
        private readonly string Match = ConfigurationManager.Configuration.GeomapTileMatch;
        private readonly int Zoom = ConfigurationManager.Configuration.GeomapDefaultZoom;
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
            Web.Source = string.Format(this.Pattern, this.Zoom, this.Odor.Latitude, this.Odor.Longitude);
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
                Match match = expression.Match(((UrlWebViewSource)Web.Source).Url);
                double latitude = double.Parse(match.Groups["C1"].Value);
                double longitude = double.Parse(match.Groups["C2"].Value);
                await Task.Run(async() =>
                {
                    IEnumerable<Placemark> placemarks = await Geocoding.GetPlacemarksAsync(latitude, longitude);
                    Placemark placemark = (placemarks)?.FirstOrDefault();
                    if (placemark != null)
                    {
                        this.Odor.Latitude = latitude;
                        this.Odor.Longitude = longitude;
                        this.Odor.AdminArea = placemark.AdminArea;
                        this.Odor.CountryCode = placemark.CountryCode;
                        this.Odor.CountryName = placemark.CountryName;
                        this.Odor.FeatureName = placemark.FeatureName;
                        this.Odor.Locality = placemark.Locality;
                        this.Odor.PostalCode = placemark.PostalCode;
                        this.Odor.SubAdminArea = placemark.SubAdminArea;
                        this.Odor.SubLocality = placemark.SubLocality;
                        this.Odor.SubThoroughfare = placemark.SubThoroughfare;
                        this.Odor.Thoroughfare = placemark.Thoroughfare;
                        this.Odor.Address = string.Format("{0}, {1}, {2}, {3}, {4}, {5}, {6}.",
                            this.Odor.Thoroughfare,
                            this.Odor.SubThoroughfare,
                            this.Odor.SubLocality,
                            this.Odor.SubAdminArea,
                            this.Odor.AdminArea,
                            this.Odor.PostalCode,
                            this.Odor.CountryCode);
                    }
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