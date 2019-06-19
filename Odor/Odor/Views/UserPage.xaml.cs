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

        public ICommand ValidateCommand { get; private set; }

        public ICommand InvalidateNameCommand { get; private set; }

        public ICommand InvalidateNumberCommand { get; private set; }

        public UserPage (User user)
		{
			InitializeComponent ();
            this.User = new User {
                Id = user.Id,
                Name = user.Name,
                Number = user.Number
            };
            SaveCommand = new Command(async () => { await this.Dispatch(); });
            ValidateCommand = new Command<object>((sender) => { this.IsValidate = !this.IsInvalidateName && !this.IsInvalidateNumber; });
            InvalidateNameCommand = new Command<object>((sender) => { this.IsInvalidateName = string.IsNullOrWhiteSpace(this.User.Name); });
            InvalidateNumberCommand = new Command<object>((sender) => { this.IsInvalidateNumber = string.IsNullOrWhiteSpace(this.User.Number); });
            BindingContext = this;
        }

        private void NameTextChanged(object sender, TextChangedEventArgs args)
        {
            InvalidateNameCommand.Execute(sender);
            ValidateCommand.Execute(sender);
        }

        private void NumberTextChanged(object sender, TextChangedEventArgs args)
        {
            InvalidateNumberCommand.Execute(sender);
            ValidateCommand.Execute(sender);
        }


        async Task Dispatch()
        {
            if (this.IsValidate && !this.IsBusy)
            {
                this.IsBusy = true;
                await this.Save();
            }
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

        private bool isInvalidateName = false;
        public bool IsInvalidateName
        {
            get { return isInvalidateName; }
            set
            {
                isInvalidateName = value;
                OnPropertyChanged();
            }
        }

        private bool isInvalidateNumber = false;
        public bool IsInvalidateNumber
        {
            get { return isInvalidateNumber; }
            set
            {
                isInvalidateNumber = value;
                OnPropertyChanged();
            }
        }

        private bool isValidate = false;
        public bool IsValidate
        {
            get { return isValidate; }
            set
            {
                isValidate = value;
                OnPropertyChanged();
            }
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