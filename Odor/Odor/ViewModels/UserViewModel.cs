using Odor.Models;
using Odor.Views;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace Odor.ViewModels
{
    public class UserViewModel : BaseViewModel<User>
    {
        public User User { get; set; }

        public UserViewModel()
        {
            MessagingCenter.Subscribe<string>(this, "GetUser", async (user) =>
            {
                if (string.IsNullOrEmpty((this.User = await DataStore.Get(this.User)).Id))
                {
                    MessagingCenter.Send(string.Empty, "User");
                }
            });
            MessagingCenter.Subscribe<User>(this, "AddUser", async (user) =>
            {
                if (await DataStore.Add(user))
                {
                    MessagingCenter.Send("Sucesso", "Menu", "Informações pessoais cadastradas.");
                } else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<User>(this, "UpdateUser", async (user) =>
            {
                if (await DataStore.Update(user))
                {
                    MessagingCenter.Send("Sucesso", "Menu", "Informações pessoais cadastradas.");
                }
                else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
        }
    }
}
