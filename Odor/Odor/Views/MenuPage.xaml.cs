using Odor.ViewModels;
using System;
using System.Linq;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MenuPage : MasterDetailPage
    {
        private readonly OdorViewModel OdorViewModel;

        private readonly UserViewModel UserViewModel;
        public MenuPage()
        {
            InitializeComponent();
            this.OdorViewModel = new OdorViewModel();
            BindingContext = this.UserViewModel = new UserViewModel();
            Detail = new NavigationPage(new MasterPage(this.OdorViewModel));
            MessagingCenter.Subscribe<string, string>(this, "Menu", (Title, Message) => {
                DisplayAlert(Title, Message, "Ok");
            });
            MessagingCenter.Subscribe<string>(this, "Odor", (Id) => {
                if (string.IsNullOrEmpty(this.UserViewModel.User.Id))
                {
                    Detail.Navigation.PushAsync(new UserPage(this.UserViewModel.User));
                }
                else
                {
                    Detail.Navigation.PushAsync(new OdorPage(this.OdorViewModel.Odors.Where(odor => odor.Id.Equals(Id)).FirstOrDefault() ?? new Models.Odor { UserId = this.UserViewModel.User.Id }));
                }
                IsPresented = false;
            });
            MessagingCenter.Subscribe<string>(this, "User", (Id) => {
                if (string.IsNullOrEmpty(Id))
                {
                    Detail.Navigation.PushAsync(new UserPage(this.UserViewModel.User));
                    IsPresented = false;
                }
                else
                {
                    MessagingCenter.Send(Id, "QueryOdor");
                }
            });
            MessagingCenter.Send(string.Empty, "GetUser");
        }
        private void GoUserPage(object sender, EventArgs args)
        {
            Detail.Navigation.PushAsync(new UserPage(this.UserViewModel.User));
            IsPresented = false;
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
        private void GoAboutPage(object sender, EventArgs args)
        {
            Detail.Navigation.PushAsync(new AboutPage());
            IsPresented = false;
        }
    }
}