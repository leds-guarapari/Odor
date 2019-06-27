using System;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class OdorPage : ContentPage
    {
        public Models.Odor Odor { get; set; }
        public ICommand SaveCommand { get; private set; }
        public OdorPage(Models.Odor odor)
        {
            InitializeComponent();
            this.Odor = new Models.Odor
            {
                Id = odor.Id,
                UserId = odor.UserId,
                Intensity = odor.Intensity,
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
                Thoroughfare = odor.Thoroughfare,
                Type = odor.Type,
                Date = odor.Date,
                Begin = odor.Begin,
                End = odor.End
            };
            SaveCommand = new Command(async () => { await this.Dispatch(); });
            MessagingCenter.Subscribe<Models.Odor>(this, "MapsOdor", (Odor) =>
            {
                this.Odor.Latitude = Odor.Latitude;
                this.Odor.Longitude = Odor.Longitude;
                this.Odor.Address = Odor.Address;
                this.Odor.AdminArea = Odor.AdminArea;
                this.Odor.CountryCode = Odor.CountryCode;
                this.Odor.CountryName = Odor.CountryName;
                this.Odor.FeatureName = Odor.FeatureName;
                this.Odor.Locality = Odor.Locality;
                this.Odor.PostalCode = Odor.PostalCode;
                this.Odor.SubAdminArea = Odor.SubAdminArea;
                this.Odor.SubLocality = Odor.SubLocality;
                this.Odor.SubThoroughfare = Odor.SubThoroughfare;
                this.Odor.Thoroughfare = Odor.Thoroughfare;
                OnPropertyChanged("Odor");
            });
            BindingContext = this;
        }
        async Task Dispatch()
        {
            if (!this.IsBusy)
            {
                this.IsBusy = true;
                await this.Save();
            }
        }
        async Task Save()
        {
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                if (string.IsNullOrEmpty(this.Odor.Id))
                {
                    MessagingCenter.Send(this.Odor, "AddOdor");
                }
                else
                {
                    MessagingCenter.Send(this.Odor, "UpdateOdor");
                }
            }));
            await Navigation.PopToRootAsync();
        }
        async Task Delete()
        {
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                if (!string.IsNullOrEmpty(this.Odor.Id))
                {
                    MessagingCenter.Send(this.Odor, "DeleteOdor");
                }
            }));
            await Navigation.PopToRootAsync();
        }
        private bool isBusy = false;
        public new bool IsBusy
        {
            get { return isBusy; }
            set
            {
                isBusy = value;
                OnPropertyChanged("IsBusy");
            }
        }
        private async void OnButtonClicked(object sender, EventArgs args)
        {
            await Navigation.PushAsync(new MapsPage(this.Odor), true);
        }
        private async void OnDeleteButtonClicked(object sender, EventArgs e)
        {
            if (await this.DisplayAlert("Confirmação", "Você realmente quer excluir este odor?", "Excluir", "Cancelar"))
            {
                this.IsBusy = true;
                await this.Delete();
            }
        }
    }
}