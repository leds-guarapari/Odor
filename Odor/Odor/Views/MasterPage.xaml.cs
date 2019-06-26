using Odor.ViewModels;
using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MasterPage : ContentPage
    {
        private readonly OdorViewModel OdorViewModel;
        public MasterPage(OdorViewModel OdorViewModel)
        {
            InitializeComponent();
            BindingContext = this.OdorViewModel = OdorViewModel;
        }
        protected override void OnAppearing()
        {
            base.OnAppearing();
            bool isEmpty = this.OdorViewModel.Odors.Count == 0;
            Header.IsVisible = !isEmpty;
            Footer.IsVisible = isEmpty;
        }
        private void OnItemTapped(object sender, ItemTappedEventArgs args)
        {
            MessagingCenter.Send(((Models.Odor) args.Item).Id, "Odor");
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
    }
}