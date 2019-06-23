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
                MessagingCenter.Send((this.User = await DataStore.Get(new Models.User { Id = Id })).Id, "User");
            });
            MessagingCenter.Subscribe<Models.User>(this, "AddUser", async (user) =>
            {
                if (await DataStore.Add(user))
                {
                    this.User = user;
                    MessagingCenter.Send("Sucesso", "Menu", "Informações pessoais cadastradas.");
                }
                else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<Models.User>(this, "UpdateUser", async (user) =>
            {
                if (await DataStore.Update(user))
                {
                    this.User = user;
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