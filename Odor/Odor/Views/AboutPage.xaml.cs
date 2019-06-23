using Odor.Services;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AboutPage : ContentPage
    {
        public string Organization { get; set; }
        public AboutPage()
        {
            InitializeComponent();
            this.Organization = ConfigurationManager.Configuration.Organization;
            BindingContext = this;
        }
    }
}