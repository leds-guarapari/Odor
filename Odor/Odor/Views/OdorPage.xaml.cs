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
        public Models.Odor Odor {get; set;}
        public ICommand SaveCommand { get; private set; }
        public OdorPage (Models.Odor odor)
		{
			InitializeComponent ();
            this.Odor = new Models.Odor
            {
                Id = odor.Id,
                UserId = odor.UserId,
                Intensity = odor.Intensity,
                Latitude = odor.Latitude,
                Longitude = odor.Longitude,
                Address = odor.Address,
                Location = odor.Location,
                Type = odor.Type,
                Date = odor.Date,
                Begin = odor.Begin,
                End = odor.End
            };
            SaveCommand = new Command(async () => { await this.Dispatch(); });
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
        private async void OnButtonClicked(object sender, EventArgs args)
        {
            await Navigation.PushAsync(new MapsPage(this.Odor), true);
        }
    }
}