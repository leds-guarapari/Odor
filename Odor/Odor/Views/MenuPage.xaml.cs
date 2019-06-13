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

        private UserViewModel viewModel;

        public MenuPage()
        {
            InitializeComponent();
            BindingContext = this.viewModel = new UserViewModel();
            this.viewModel.LoadUserCommand.Execute(null);
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            User user = this.viewModel.User;
            if (user == null || string.IsNullOrEmpty(user.Id))
            {
                Detail.Navigation.PushAsync(new UserPage());
                IsPresented = false;
            }
        }

        private void GoUserPage(object sender, EventArgs args)
        {
            User user = this.viewModel.User;
            Detail.Navigation.PushAsync(new UserPage());
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