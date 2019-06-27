using Newtonsoft.Json.Linq;
using Odor.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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
        private readonly Location Location = ConfigurationManager.Location;
        private readonly Models.Odor Odor;
        public ICommand ConfirmCommand { get; private set; }
        public MapsPage(Models.Odor odor)
        {
            InitializeComponent();
            this.Odor = new Models.Odor
            {
                Latitude = (odor.Latitude != 0) ? odor.Latitude : Location.Latitude,
                Longitude = (odor.Longitude != 0) ? odor.Longitude : Location.Longitude,
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
            HtmlWebViewSource HtmlWebViewSource = new HtmlWebViewSource();
            HtmlWebViewSource.Html = @"<!DOCTYPE html>
            <html>
                <head>
                    <meta charset='utf-8' />
                    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
                    <link rel='stylesheet' href='https://unpkg.com/leaflet@1.5.1/dist/leaflet.css' integrity='sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==' crossorigin=''/>
                    <script src = 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.js' integrity='sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==' crossorigin=''></script>
                    <style>
                        body { margin:0; padding:0; }
                        #map { position:absolute; top:0; bottom:0; width:100%; }
                    </style>
                </head>
                <body>
                    <div id='map'></div>
                    <script>
                        var map = L.map('map').setView([" + this.Odor.Latitude + ", " + this.Odor.Longitude + "], " + ConfigurationManager.Configuration.MapDefaultZoom + @");
	                    L.tileLayer('" + ConfigurationManager.Configuration.MapTileLayer + @"', {
		                    maxZoom: 18,
		                    attribution: '"
                                + "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors<br/>"
                                + "<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA, </a>"
                                + "Imagery &copy; <a href=\"https://www.mapbox.com/\">Mapbox</a>" +
                            @"',
                            id: 'mapbox.streets'
	                    }).addTo(map);
                    </script>
                </body>
            </html>";
            Web.Source = HtmlWebViewSource;
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
                string result = await Web.EvaluateJavaScriptAsync($"map.getCenter()");
                JObject point = JObject.Parse(result);
                double latitude = (double)point["lat"];
                double longitude = (double)point["lng"];
                await Task.Run(async () =>
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