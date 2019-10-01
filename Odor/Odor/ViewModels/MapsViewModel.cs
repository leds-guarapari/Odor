using Xamarin.Forms.Maps;
using System.Linq;
using Odor.Services;
using System;
using System.Diagnostics;
using Xamarin.Forms;
using System.Threading.Tasks;

namespace Odor.ViewModels
{
    public class MapsViewModel : BaseViewModel<Models.Odor>
    {
        public Position Position { get; set; }
        public string Address { get; set; }
        public async Task Pinned(Map map, Position position)
        {
            map.Pins.Clear();
            Pin pin = new Pin
            {
                Label = ConfigurationManager.Configuration.LocalizingAddress,
                Type = PinType.Place,
                Position = position
            };
            map.Pins.Add(pin);
            this.Position = position;
            try
            {
                pin.Address = this.Address = (await (new Geocoder()).GetAddressesForPositionAsync(position)).LastOrDefault();
                pin.Label = ConfigurationManager.Configuration.LocalizedAddress;
            }
            catch (Exception exception)
            {
                MessagingCenter.Send("Aviso", "Message", "Não foi possível obter o endereço.");
                Debug.WriteLine(exception);
            }
        }
    }
}