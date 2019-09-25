using Odor.Services;
using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MasterPage : ContentPage
    {
        public string Organization { get; set; }
        public MasterPage()
        {
            InitializeComponent();
            this.Organization = ConfigurationManager.Configuration.Organization;
            BindingContext = this;
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
    }
}