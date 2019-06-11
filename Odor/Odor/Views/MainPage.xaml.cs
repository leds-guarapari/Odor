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
            this.viewModel = new UserViewModel();
            BindingContext = this.viewModel;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            viewModel.LoadUserCommand.Execute(null);
        }

    }

}