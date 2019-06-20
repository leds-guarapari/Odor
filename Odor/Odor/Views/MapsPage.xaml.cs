using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class MapsPage : ContentPage
	{
        private Models.Odor Odor;
        public string Address { get; set; }
        public string Tile { get; set; }
        public MapsPage (Models.Odor odor)
		{
			InitializeComponent ();
            this.Odor = odor;
            this.Address = this.Odor.Address;
            this.Tile = "https://www.openstreetmap.org/";
            BindingContext = this;
        }
        private void WebViewNavigating(object sender, WebNavigatingEventArgs e)
        {
            IsBusy = true;
        }
        private void WebViewNavigated(object sender, WebNavigatedEventArgs e)
        {
            IsBusy = false;
            // TODO search api geolocation nomination
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