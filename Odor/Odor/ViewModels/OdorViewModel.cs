using System.Collections.ObjectModel;
using System.Linq;
using Xamarin.Forms;

namespace Odor.ViewModels
{
    public class OdorViewModel : BaseViewModel<Models.Odor>
    {
        public ObservableCollection<Models.Odor> Odors { get; set; }
        public OdorViewModel()
        {
            this.Odors = new ObservableCollection<Models.Odor>();
            MessagingCenter.Subscribe<Models.Odor>(this, "AddOdor", async (odor) =>
            {
                if (await DataStore.Add(odor))
                {
                    this.Odors.Add(odor);
                    MessagingCenter.Send("Sucesso", "Message", "Novo odor cadastrado.");
                }
                else
                {
                    MessagingCenter.Send("Aviso", "Message", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<Models.Odor>(this, "UpdateOdor", async (odor) =>
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
            });
            MessagingCenter.Subscribe<Models.Odor>(this, "DeleteOdor", async (odor) =>
            {
                if (await DataStore.Delete(odor))
                {
                    this.Odors.Remove(this.Odors.Where(element => element.Id.Equals(odor.Id)).FirstOrDefault());
                    MessagingCenter.Send("Sucesso", "Message", "Odor excluído.");
                }
                else
                {
                    MessagingCenter.Send("Aviso", "Message", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<string>(this, "QueryOdor", async (Id) =>
            {
                this.Odors.Clear();
                foreach (Models.Odor odor in await DataStore.Query(new Models.Odor { UserId = Id }))
                {
                    this.Odors.Add(odor);
                }
            });
        }
    }
}