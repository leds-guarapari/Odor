using Odor.Models;
using System;
using System.ComponentModel;
using System.Threading;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class UserPage : ContentPage
    {
        public User User { get; set; }

        public UserPage (User user)
		{
			InitializeComponent ();
            this.User = user;
            BindingContext = this;
        }

        void SaveClicked(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(User.Name) || string.IsNullOrEmpty(User.Number))
            {
                DisplayAlert("Aviso", "Dados obrigatórios.", "Ok");
            }
            else
            {
                //IsLoading = true;
                //Thread.Sleep(5000);
                if (string.IsNullOrEmpty(User.Id))
                {
                    MessagingCenter.Send(this, "AddUser", User);
                }
                else
                {
                    MessagingCenter.Send(this, "UpdateUser", User);
                }
                //IsLoading = false;
                Navigation.PopToRootAsync();
            }
        }
    }
}