using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Odor.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class UserPage : ContentPage, INotifyPropertyChanged
    {
        public Models.User User { get; set; }
        public ICommand SaveCommand { get; private set; }
        public ICommand ValidateCommand { get; private set; }
        public ICommand InvalidateNameCommand { get; private set; }
        public ICommand InvalidateNumberCommand { get; private set; }
        public UserPage(Models.User user)
        {
            InitializeComponent();
            this.User = new Models.User
            {
                Id = user.Id,
                Name = user.Name,
                Number = user.Number
            };
            this.SaveCommand = new Command(async () => { await this.Dispatch(); });
            this.ValidateCommand = new Command(() => { this.IsValidate = !this.IsInvalidateName && !this.IsInvalidateNumber; });
            this.InvalidateNameCommand = new Command(() => { this.IsInvalidateName = string.IsNullOrWhiteSpace(this.User.Name); });
            this.InvalidateNumberCommand = new Command(() => { this.IsInvalidateNumber = string.IsNullOrWhiteSpace(this.User.Number); });
            BindingContext = this;
        }
        private void NameTextChanged(object sender, TextChangedEventArgs args)
        {
            this.InvalidateNameCommand.Execute(null);
            this.ValidateCommand.Execute(null);
        }
        private void NumberTextChanged(object sender, TextChangedEventArgs args)
        {
            this.InvalidateNumberCommand.Execute(null);
            this.ValidateCommand.Execute(null);
        }
        async Task Dispatch()
        {
            if (this.IsValidate && !this.IsBusy)
            {
                this.IsBusy = true;
                await this.Save();
            }
            else
            {
                this.InvalidateNameCommand.Execute(null);
                this.InvalidateNumberCommand.Execute(null);
            }
        }
        async Task Save()
        {
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                if (string.IsNullOrEmpty(this.User.Id))
                {
                    MessagingCenter.Send(this.User, "AddUser");
                }
                else
                {
                    MessagingCenter.Send(this.User, "UpdateUser");
                }
            }));
            await Navigation.PopToRootAsync();
        }
        private bool isInvalidateName = false;
        public bool IsInvalidateName
        {
            get { return this.isInvalidateName; }
            set
            {
                this.isInvalidateName = value;
                OnPropertyChanged("IsInvalidateName");
            }
        }
        private bool isInvalidateNumber = false;
        public bool IsInvalidateNumber
        {
            get { return this.isInvalidateNumber; }
            set
            {
                this.isInvalidateNumber = value;
                OnPropertyChanged("IsInvalidateNumber");
            }
        }
        private bool isValidate = false;
        public bool IsValidate
        {
            get { return this.isValidate; }
            set
            {
                this.isValidate = value;
                OnPropertyChanged("IsValidate");
            }
        }
        private bool isBusy = false;
        public new bool IsBusy
        {
            get { return this.isBusy; }
            set
            {
                this.isBusy = value;
                OnPropertyChanged("IsBusy");
            }
        }
    }
}