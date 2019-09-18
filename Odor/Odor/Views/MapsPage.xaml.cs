using Odor.ViewModels;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Maps;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MapsPage : ContentPage
    {
        private readonly MapsViewModel MapsViewModel;
        private readonly string Message;
        public ICommand ConfirmCommand { get; private set; }
        public MapsPage(MapsViewModel MapsViewModel, string Message)
        {
            InitializeComponent();
            this.MapsViewModel = new MapsViewModel
            {
                Position = MapsViewModel.Position,
                Address = MapsViewModel.Address
            };
            this.Message = Message;
            ConfirmCommand = new Command(async () => { await this.Dispatch(); });
            BindingContext = this;
            Task.Run(() => Device.BeginInvokeOnMainThread(async () =>
            {
                this.IsBusy = true;
                this.Maps.MoveToRegion(MapSpan.FromCenterAndRadius(this.MapsViewModel.Position, Distance.FromKilometers(1)));
                await this.MapsViewModel.Pinned(this.Maps, this.MapsViewModel.Position);
                this.IsBusy = false;
            }));
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
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                MessagingCenter.Send(this.MapsViewModel, this.Message);
            }));
            await Navigation.PopAsync();
        }
        private async void OnMapClicked(object sender, MapClickedEventArgs args)
        {
            this.IsBusy = true;
            await this.MapsViewModel.Pinned((Map) sender, args.Position);
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