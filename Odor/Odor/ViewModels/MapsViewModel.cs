using Xamarin.Forms.Maps;

namespace Odor.ViewModels
{
    public class MapsViewModel : BaseViewModel<Models.Odor>
    {
        public Position Position { get; set; }
        public void Pinned(Map map, Position position)
        {
            map.Pins.Clear();
            map.Pins.Add(new Pin
            {
                Label = "Odor",
                Type = PinType.Place,
                Position = position
            });
            this.Position = position;
        }
    }
}
