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

        public Command LoadUserCommand { get; private set; }

        public UserViewModel()
        {
            LoadUserCommand = new Command(async () => await ExecuteLoadUserCommand());
            MessagingCenter.Subscribe<UserPage, User>(this, "AddUser", async (page, user) =>
            {
                if (await DataStore.Add(user))
                {
                    MessagingCenter.Send("Sucesso", "Menu", "Informações pessoais cadastradas.");
                } else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<UserPage, User>(this, "UpdateUser", async (page, user) =>
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

        private async Task ExecuteLoadUserCommand()
        {
            if (this.IsBusy)
                return;
            this.IsBusy = true;
            try
            {
                User = await DataStore.Get(User);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            finally
            {
                this.IsBusy = false;
            }
        }
    }
}
