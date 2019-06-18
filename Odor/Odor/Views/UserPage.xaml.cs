using Odor.Models;
using System;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class UserPage : ContentPage, INotifyPropertyChanged
    {
        public User User { get; set; }

        public ICommand SaveCommand { get; private set; }

        public UserPage (User user)
		{
			InitializeComponent ();
            this.User = user;
            SaveCommand = new Command(async () => { IsBusy = true; await Save(); }, () => !string.IsNullOrEmpty(User.Name) && !string.IsNullOrEmpty(User.Number) );
            BindingContext = this;
        }

        async Task Save()
        {
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                if (string.IsNullOrEmpty(User.Id))
                {
                    MessagingCenter.Send(User, "AddUser");
                }
                else
                {
                    MessagingCenter.Send(User, "UpdateUser");
                }
            }));
            await Navigation.PopToRootAsync();
        }

        private bool isBusy = false;
        public new bool IsBusy
        {
            get { return isBusy; }
            set
            {
                isBusy = value;
                OnPropertyChanged();
            }
        }
    }
}