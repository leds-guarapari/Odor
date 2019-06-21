using Odor.ViewModels;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Xamarin.Essentials;
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
            MessagingCenter.Subscribe<string, string>(this, "Menu", async (Title, Message) => {
                await DisplayAlert(Title, Message, "Ok");
            });
            MessagingCenter.Subscribe<string>(this, "Odor", async (Id) => {
                if (string.IsNullOrEmpty(this.UserViewModel.User.Id))
                {
                    await Detail.Navigation.PushAsync(new UserPage(this.UserViewModel.User));
                }
                else
                {
                    Location location = await Location();
                    await Detail.Navigation.PushAsync(
                        new OdorPage(this.OdorViewModel.Odors.Where(element => element.Id.Equals(Id)).FirstOrDefault() ??
                        new Models.Odor {
                            UserId = this.UserViewModel.User.Id,
                            Intensity = "Desagradável",
                            Type = "Químico",
                            Latitude = location.Latitude,
                            Longitude = location.Longitude,
                            Address = "Não informado.",
                            Date = DateTime.Today,
                            Begin = DateTime.Now.TimeOfDay.Subtract(TimeSpan.FromHours(1)),
                            End = DateTime.Now.TimeOfDay
                        }));
                }
                IsPresented = false;
            });
            MessagingCenter.Subscribe<string>(this, "User", async (Id) => {
                if (string.IsNullOrEmpty(Id))
                {
                    await Detail.Navigation.PushAsync(new UserPage(this.UserViewModel.User));
                    IsPresented = false;
                }
                else
                {
                    MessagingCenter.Send(Id, "QueryOdor");
                }
            });
            MessagingCenter.Send(string.Empty, "GetUser");
        }
        private async void GoUserPage(object sender, EventArgs args)
        {
            await Detail.Navigation.PushAsync(new UserPage(this.UserViewModel.User));
            IsPresented = false;
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
        private async void GoAboutPage(object sender, EventArgs args)
        {
            await Detail.Navigation.PushAsync(new AboutPage());
            IsPresented = false;
        }
        public static async Task<Location> Location()
        {
            try
            {
                return await Geolocation.GetLastKnownLocationAsync();
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return await Task.FromResult(new Location(-20.2635, -40.2660));
        }
    }
}