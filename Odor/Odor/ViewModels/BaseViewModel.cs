using Odor.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Xamarin.Forms;

namespace Odor.ViewModels
{
    public class BaseViewModel<T> : INotifyPropertyChanged
    {

        public IDataStore<T> DataStore => DependencyService.Get<IDataStore<T>>();

        private bool isBusy = false;
        public bool IsBusy
        {
            get { return isBusy; }
            set { SetProperty(ref isBusy, value); }
        }

        protected bool SetProperty<P>(ref P storage, P value,
            [CallerMemberName]string propertyName = null,
            Action onChanged = null)
        {
            if (EqualityComparer<P>.Default.Equals(storage, value)) return false;
            storage = value;
            OnPropertyChanged(propertyName);
            onChanged?.Invoke();
            return true;
        }

        #region INotifyPropertyChanged
        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged([CallerMemberName]string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs((propertyName)));
        }
        #endregion
    }
}
