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
        protected override void OnAppearing()
        {
            base.OnAppearing();
            this.OnRefresh();
        }
        private void OnRefresh()
        {
            bool isEmpty = ((OdorViewModel)BindingContext).Odors.Count == 0;
            Header.IsVisible = !isEmpty;
            Footer.IsVisible = isEmpty;
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