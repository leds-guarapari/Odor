using Odor.ViewModels;
using System;
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
            BindingContext = this.MapsViewModel = MapsViewModel;
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
        private void OnMapClicked(object sender, MapClickedEventArgs args)
        {
            this.MapsViewModel.Position = args.Position;
        }
    }
}