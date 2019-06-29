using Odor.ViewModels;
using System;
using System.Threading.Tasks;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MasterPage : ContentPage
    {
        public MasterPage(OdorViewModel OdorViewModel)
        {
            InitializeComponent();
            BindingContext = OdorViewModel;
            MessagingCenter.Subscribe<string>(this, "DeletedOdor", (IsVisible) =>
            {
                Header.IsVisible = bool.Parse(IsVisible);
            });
        }
        private void OnItemAppearing(object sender, ItemVisibilityEventArgs args)
        {
            Header.IsVisible = true;
        }
        private void OnItemTapped(object sender, ItemTappedEventArgs args)
        {
            MessagingCenter.Send(((Models.Odor)args.Item).Id, "Odor");
        }
        private void GoOdorPage(object sender, EventArgs args)
        {
            MessagingCenter.Send(string.Empty, "Odor");
        }
    }
}