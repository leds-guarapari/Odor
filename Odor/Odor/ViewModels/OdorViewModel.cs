using System.Collections.Generic;
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
                    MessagingCenter.Send("Sucesso", "Menu", "Novo odor cadastrado.");
                } else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<Models.Odor>(this, "UpdateOdor", async (odor) =>
            {
                if (await DataStore.Update(odor))
                {
                    Models.Odor Odor = this.Odors.Where(o => o.Id.Equals(odor.Id)).FirstOrDefault();
                    Odor.Intensity = odor.Intensity;
                    Odor.Latitude = odor.Latitude;
                    Odor.Longitude = odor.Longitude;
                    Odor.Address = odor.Address;
                    Odor.Type = odor.Type;
                    Odor.Duration = odor.Duration;
                    Odor.DateTime = odor.DateTime;
                    MessagingCenter.Send("Sucesso", "Menu", "Informações sobre odor atualizados.");
                }
                else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<Models.Odor>(this, "DeleteOdor", async (odor) =>
            {
                if (await DataStore.Delete(odor))
                {
                    this.Odors.Remove(this.Odors.Where(o => o.Id.Equals(odor.Id)).FirstOrDefault());
                    MessagingCenter.Send("Sucesso", "Menu", "Odor excluído.");
                }
                else
                {
                    MessagingCenter.Send("Aviso", "Menu", "Ocorreu um erro inesperado.");
                }
            });
            MessagingCenter.Subscribe<string>(this, "QueryOdor", async (Id) =>
            {
                foreach (Models.Odor odor in await DataStore.Query(new Models.Odor { UserId = Id }))
                {
                    this.Odors.Add(odor);
                }
            });
        }
    }
}