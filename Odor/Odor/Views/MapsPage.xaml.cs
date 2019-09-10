using Odor.ViewModels;
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
        public ICommand ConfirmCommand { get; private set; }
        public MapsPage(MapsViewModel MapsViewModel)
        {
            InitializeComponent();
            BindingContext = this.MapsViewModel = MapsViewModel;
        }
        private void OnMapClicked(object sender, MapClickedEventArgs args)
        {
            this.MapsViewModel.Pinned((Map)sender, args.Position);
        }
    }
}