using Odor.Models;
using Odor.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MenuPage : MasterDetailPage
    {

        private UserViewModel viewModel;

        public MenuPage(UserViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = this.viewModel = new UserViewModel();
            User user = this.viewModel.User;
            if (user != null && user.Id != null && user.Id.Length > 0)
            {
                Detail = new NavigationPage(new MasterPage());
                IsPresented = true;
            } else
            {
                Detail = new NavigationPage(new UserPage());
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