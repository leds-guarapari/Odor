using Odor.ViewModels;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Maps;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MasterPage : ContentPage
    {
        private readonly MapsViewModel MapsViewModel;
        public MasterPage(MapsViewModel MapsViewModel)
        {
            InitializeComponent();
            this.MapsViewModel = MapsViewModel;
            BindingContext = this;
            Task.Run(() => Device.BeginInvokeOnMainThread(async () =>
            {
                this.IsBusy = true;
                try
                {
                    Location location = await Geolocation.GetLastKnownLocationAsync();
                    if (location == null)
                    {
                        location = await Geolocation.GetLocationAsync(new GeolocationRequest(GeolocationAccuracy.Best));
                    }
                    if (location != null)
                    {
                        Position position = new Position(location.Latitude, location.Longitude);
                        this.Maps.MoveToRegion(MapSpan.FromCenterAndRadius(position, Distance.FromKilometers(1)));
                        await this.MapsViewModel.Pinned(this.Maps, position);
                    }
                }
                catch (Exception exception)
                {
                    Debug.WriteLine(exception);
                }
                this.IsBusy = false;
            }));
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
        private async void OnMapClicked(object sender, MapClickedEventArgs args)
        {
            this.IsBusy = true;
            await this.MapsViewModel.Pinned((Xamarin.Forms.Maps.Map) sender, args.Position);
            this.IsBusy = false;
        }
        private bool isBusy = false;
        public new bool IsBusy {
            get { return isBusy; }
            set {
                isBusy = value;
                OnPropertyChanged("IsBusy");
            }
        }
    }
}