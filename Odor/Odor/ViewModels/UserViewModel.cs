using Odor.Models;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace Odor.ViewModels
{
    public class UserViewModel : BaseViewModel<User>
    {

        public User User;

        public Command LoadUserCommand { get; set; }

        public UserViewModel()
        {
            LoadUserCommand = new Command(async () => await ExecuteLoadUserCommand());
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
                IsBusy = false;
            }
        }

    }
}
