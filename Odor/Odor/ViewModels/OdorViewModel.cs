using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using Xamarin.Forms;

namespace Odor.ViewModels
{
    public class OdorViewModel : BaseViewModel<Models.Odor>
    {
        public ObservableCollection<Models.Odor> Odors { get; set; }
        public bool IsEmpty { get; set; }
        public OdorViewModel()
        {
            this.Odors = new ObservableCollection<Models.Odor>();
            this.EvaluateIsEmpty();
            MessagingCenter.Subscribe<Models.Odor>(this, "AddOdor", async (odor) =>
            {
                try
                {
                    if (await DataStore.Add(odor))
                    {
                        this.Odors.Add(odor);
                        this.EvaluateIsEmpty();
                        MessagingCenter.Send("Sucesso", "Message", "Novo odor cadastrado.");
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
            MessagingCenter.Subscribe<Models.Odor>(this, "UpdateOdor", async (odor) =>
            {
                try
                {
                    if (await DataStore.Update(odor))
                    {
                        int index = this.Odors.IndexOf(this.Odors.Where(element => element.Id.Equals(odor.Id)).FirstOrDefault());
                        this.Odors.RemoveAt(index);
                        this.Odors.Insert(index, odor);
                        MessagingCenter.Send("Sucesso", "Message", "Informações sobre odor atualizados.");
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
            MessagingCenter.Subscribe<Models.Odor>(this, "DeleteOdor", async (odor) =>
            {
                try
                {
                    if (await DataStore.Delete(odor))
                    {
                        this.Odors.Remove(this.Odors.Where(element => element.Id.Equals(odor.Id)).FirstOrDefault());
                        this.EvaluateIsEmpty();
                        MessagingCenter.Send("Sucesso", "Message", "Odor excluído.");
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
            MessagingCenter.Subscribe<string>(this, "QueryOdor", async (Id) =>
            {
                try
                {
                    this.Odors.Clear();
                    foreach (Models.Odor odor in await DataStore.Query(new Models.Odor { UserId = Id }))
                    {
                        this.Odors.Add(odor);
                    }
                    this.EvaluateIsEmpty();
                }
                catch (Exception exception)
                {
                    Debug.WriteLine(exception);
                }
            });
        }
        private void EvaluateIsEmpty()
        {
            IsEmpty = this.Odors.Count == 0;
            OnPropertyChanged("IsEmpty");
        }
    }
}