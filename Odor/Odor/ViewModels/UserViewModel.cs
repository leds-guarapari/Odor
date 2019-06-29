using System;
using System.Diagnostics;
using Xamarin.Forms;

namespace Odor.ViewModels
{
    public class UserViewModel : BaseViewModel<Models.User>
    {
        public Models.User User { get; set; }
        public UserViewModel()
        {
            this.User = new Models.User();
            MessagingCenter.Subscribe<string>(this, "GetUser", async (Id) =>
            {
                try
                {
                    MessagingCenter.Send((this.User = await DataStore.Get(new Models.User { Id = Id })).Id ?? string.Empty, "User");
                }
                catch (Exception exception)
                {
                    Debug.WriteLine(exception);
                }
            });
            MessagingCenter.Subscribe<Models.User>(this, "AddUser", async (user) =>
            {
                try
                {
                    if (await DataStore.Add(user))
                    {
                        this.User = user;
                        MessagingCenter.Send("Sucesso", "Message", "Informações pessoais cadastradas.");
                    }
                    else
                    {
                        MessagingCenter.Send("Aviso", "Message", "Ocorreu um erro inesperado.");
                    }
                }
                catch (Exception exception)
                {
                    Debug.WriteLine(exception);
                    MessagingCenter.Send("Operação não realizada", "Message", "Tente mais tarde.");
                }
            });
            MessagingCenter.Subscribe<Models.User>(this, "UpdateUser", async (user) =>
            {
                try
                {
                    if (await DataStore.Update(user))
                    {
                        this.User = user;
                        MessagingCenter.Send("Sucesso", "Message", "Informações pessoais cadastradas.");
                    }
                    else
                    {
                        MessagingCenter.Send("Aviso", "Message", "Ocorreu um erro inesperado.");
                    }
                }
                catch (Exception exception)
                {
                    Debug.WriteLine(exception);
                    MessagingCenter.Send("Operação não realizada", "Message", "Tente mais tarde.");
                }
            });
        }
    }
}