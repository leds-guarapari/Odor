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
            } else
            {
                Detail = new NavigationPage(new UserPage());
            }
        }

        /*private void ListView_ItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            var item = e.SelectedItem as MenuPageMenuItem;
            if (item == null)
                return;

            var page = (Page)Activator.CreateInstance(item.TargetType);
            page.Title = item.Title;

            Detail = new NavigationPage(page);
            IsPresented = false;

            MasterPage.ListView.SelectedItem = null;
        }*/

    }
}