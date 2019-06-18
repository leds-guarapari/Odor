using Odor.Models;
using Odor.ViewModels;
using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MenuPage : MasterDetailPage
    {

        private readonly UserViewModel viewModel;

        public MenuPage()
        {
            InitializeComponent();
            BindingContext = this.viewModel = new UserViewModel();
            MessagingCenter.Subscribe<string, string>(this, "Menu", (Title, Message) => {
                DisplayAlert(Title, Message, "Ok");
            });
            MessagingCenter.Subscribe<string>(this, "Odor", (Id) => {
                Detail.Navigation.PushAsync(new OdorPage());
                IsPresented = false;
            });
            MessagingCenter.Subscribe<string>(this, "User", (Id) => {
                Detail.Navigation.PushAsync(new UserPage(this.viewModel.User));
                IsPresented = false;
            });
            MessagingCenter.Send(string.Empty, "GetUser");
        }

        private void GoUserPage(object sender, EventArgs args)
        {
            Detail.Navigation.PushAsync(new UserPage(this.viewModel.User));
            IsPresented = false;
        }

        private void GoOdorPage(object sender, EventArgs args)
        {
            Detail.Navigation.PushAsync(new OdorPage());
            IsPresented = false;
        }

        private void GoAboutPage(object sender, EventArgs args)
        {
            Detail.Navigation.PushAsync(new AboutPage());
            IsPresented = false;
        }
    }
}