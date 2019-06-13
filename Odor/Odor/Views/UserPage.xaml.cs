using Odor.Models;
using Odor.ViewModels;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                if (string.IsNullOrEmpty(User.Id))
                {
                    MessagingCenter.Send(this, "AddUser", User);
                }
                else
                {
                    MessagingCenter.Send(this, "UpdateUser", User);
                }
                Navigation.PopToRootAsync();
            }
        }

    }
}