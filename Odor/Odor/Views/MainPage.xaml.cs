using Odor.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MainPage : ContentPage
    {

        private UserViewModel viewModel;

        public MainPage()
        {
            InitializeComponent();
            BindingContext = this.viewModel = new UserViewModel();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            viewModel.LoadUserCommand.Execute(null);
            if (this.viewModel.User != null && this.viewModel.User.Id != null && this.viewModel.User.Id.Length > 0)
            {
                Navigation.PushModalAsync(new MenuPage());
            } else
            {
                Navigation.PushModalAsync(new UserPage());
            }
        }

    }

}