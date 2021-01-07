using Odor.ViewModels;
using System;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Maps;

namespace Odor.Views
{
    public partial class UserPage : ContentPage, INotifyPropertyChanged
    {
        private readonly string Message = "UserMaps";
        public Models.User User { get; set; }
        public ICommand SaveCommand { get; private set; }
        public ICommand ValidateCommand { get; private set; }
        public ICommand InvalidateNameCommand { get; private set; }
        public ICommand InvalidateNumberCommand { get; private set; }
        public enum CarouselSelectedIndex : int {
            Name = 0,
            Number = 1,
            Address = 2
        }
        public UserPage(Models.User user)
        {
            InitializeComponent();
            this.User = new Models.User
            {
                Id = user.Id,
                Name = user.Name,
                Number = user.Number,
                Address = user.Address,
                Latitude = user.Latitude,
                Longitude = user.Longitude
            };
            this.SaveCommand = new Command(async () => { await this.Dispatch(); });
            this.ValidateCommand = new Command(() => { this.IsValidate = !this.IsInvalidateName && !this.IsInvalidateNumber; });
            this.InvalidateNameCommand = new Command(() => { this.IsInvalidateName = string.IsNullOrWhiteSpace(this.User.Name); });
            this.InvalidateNumberCommand = new Command(() => { this.IsInvalidateNumber = string.IsNullOrWhiteSpace(this.User.Number); });
            MessagingCenter.Subscribe<MapsViewModel>(this, this.Message, (MapsViewModel) =>
            {
                this.User.Address = MapsViewModel.Address;
                this.User.Latitude = MapsViewModel.Position.Latitude;
                this.User.Longitude = MapsViewModel.Position.Longitude;
                OnPropertyChanged("User");
            });
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
            CarouselSelectedIndex index = (CarouselSelectedIndex) carousel.SelectedIndex;
            switch (index)
            {
                case CarouselSelectedIndex.Name:
                    this.InvalidateNameCommand.Execute(null);
                    if (!IsInvalidateName)
                    {
                        ++carousel.SelectedIndex;
                    }
                    break;
                case CarouselSelectedIndex.Number:
                    this.InvalidateNumberCommand.Execute(null);
                    if (!IsInvalidateNumber)
                    {
                        ++carousel.SelectedIndex;
                    }
                    break;
                case CarouselSelectedIndex.Address:
                    this.InvalidateNameCommand.Execute(null);
                    this.InvalidateNumberCommand.Execute(null);
                    this.ValidateCommand.Execute(null);
                    if (this.IsValidate && !this.IsBusy)
                    {
                        this.IsBusy = true;
                        await this.Save();
                    }
                    else
                    {
                        if (IsInvalidateName)
                        {
                            carousel.SelectedIndex = 0;
                        } else if(IsInvalidateNumber)
                        {
                            carousel.SelectedIndex = 1;
                        }
                    }
                    break;
                default:
                    break;
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
            MessagingCenter.Unsubscribe<MapsViewModel>(this, this.Message);
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
        private async void GoMapsPage(object sender, EventArgs args)
        {
            await Navigation.PushAsync(new MapsPage(new MapsViewModel
            {
                Position = new Position(this.User.Latitude, this.User.Longitude),
                Address = this.User.Address
            }, this.Message));
        }
    }
}