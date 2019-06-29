using Odor.ViewModels;
using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MasterPage : ContentPage
    {
        public MasterPage(OdorViewModel OdorViewModel)
        {
            InitializeComponent();
            BindingContext = OdorViewModel;
        }
        private void OnItemTapped(object sender, ItemTappedEventArgs args)
        {
            MessagingCenter.Send(((Models.Odor)args.Item).Id, "Odor");
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
    }
}