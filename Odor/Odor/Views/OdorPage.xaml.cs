﻿using Odor.Services;
using Odor.ViewModels;
using System;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using Xamarin.Forms.Maps;

namespace Odor.Views
{
    public partial class OdorPage : ContentPage
    {
        private readonly string Message = "OdorMaps";
        public Models.Odor Odor { get; set; }
        public ICommand SaveCommand { get; private set; }
        public enum CarouselSelectedIndex : int
        {
            Type = 0,
            Intensity = 1,
            Nuisance = 2,
            Address = 3,
            Date = 4,
            Origin = 5
        }
        public OdorPage(Models.Odor odor)
        {
            InitializeComponent();
            this.Odor = new Models.Odor
            {
                Id = odor.Id,
                UserId = odor.UserId,
                UserName = odor.UserName,
                UserType = odor.UserType,
                UserOrigin = odor.UserOrigin,
                Intensity = odor.Intensity,
                Nuisance = odor.Nuisance,
                Type = odor.Type,
                Origin = odor.Origin,
                Address = odor.Address,
                Latitude = odor.Latitude,
                Longitude = odor.Longitude,
                Date = odor.Date,
                Begin = odor.Begin,
                End = odor.End
            };
            this.IsUserType = this.Odor.Type == ConfigurationManager.Configuration.OdorUserType;
            SaveCommand = new Command(async () => { await this.Dispatch(); });
            MessagingCenter.Subscribe<MapsViewModel>(this, this.Message, (MapsViewModel) =>
            {
                this.Odor.Address = MapsViewModel.Address;
                this.Odor.Latitude = MapsViewModel.Position.Latitude;
                this.Odor.Longitude = MapsViewModel.Position.Longitude;
                OnPropertyChanged("Odor");
            });
            BindingContext = this;
        }
        async Task Dispatch()
        {
            CarouselSelectedIndex index = (CarouselSelectedIndex) carousel.SelectedIndex;
            switch (index)
            {
                case CarouselSelectedIndex.Origin:
                    if (!this.IsBusy)
                    {
                        this.IsBusy = true;
                        await this.Save();
                    }
                    break;
                default:
                    ++carousel.SelectedIndex;
                    break;
            }
        }
        async Task Save()
        {
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                if (string.IsNullOrEmpty(this.Odor.Id))
                {
                    MessagingCenter.Send(this.Odor, "AddOdor");
                }
                else
                {
                    MessagingCenter.Send(this.Odor, "UpdateOdor");
                }
            }));
            MessagingCenter.Unsubscribe<MapsViewModel>(this, this.Message);
            await Navigation.PopToRootAsync();
        }
        async Task Delete()
        {
            await Task.Run(() => Device.BeginInvokeOnMainThread(() =>
            {
                if (!string.IsNullOrEmpty(this.Odor.Id))
                {
                    MessagingCenter.Send(this.Odor, "DeleteOdor");
                }
            }));
            MessagingCenter.Unsubscribe<MapsViewModel>(this, this.Message);
            await Navigation.PopToRootAsync();
        }
        private bool isBusy = false;
        public new bool IsBusy
        {
            get => isBusy;
            set
            {
                isBusy = value;
                OnPropertyChanged("IsBusy");
            }
        }
        private bool isUserType = false;
        public bool IsUserType
        {
            get => isUserType;
            set
            {
                isUserType = value;
                OnPropertyChanged("IsUserType");
            }
        }
        private bool isUserOrigin = false;
        public bool IsUserOrigin
        {
            get => isUserOrigin;
            set
            {
                isUserOrigin = value;
                OnPropertyChanged("IsUserOrigin");
            }
        }
        private void OnUserTypeSelectedIndexChanged(object sender, EventArgs args)
        {
            if (!(this.IsUserType = this.Odor.Type == ConfigurationManager.Configuration.OdorUserType))
            {
                this.Odor.UserType = string.Empty;
                OnPropertyChanged("Odor");
            }
        }
        private void OnUserOriginSelectedIndexChanged(object sender, EventArgs args)
        {
            if (!(this.IsUserOrigin = this.Odor.Origin == ConfigurationManager.Configuration.OdorUserOrigin))
            {
                this.Odor.UserOrigin = string.Empty;
                OnPropertyChanged("Odor");
            }
        }
        private async void OnDeleteButtonClicked(object sender, EventArgs args)
        {
            if (await this.DisplayAlert("Confirmação", "Você realmente quer excluir este odor?", "Excluir", "Cancelar"))
            {
                this.IsBusy = true;
                await this.Delete();
            }
        }
        private async void GoMapsPage(object sender, EventArgs args)
        {
            await Navigation.PushAsync(new MapsPage(new MapsViewModel {
                Position = new Position(this.Odor.Latitude, this.Odor.Longitude),
                Address = this.Odor.Address
            }, this.Message));
        }
    }
}