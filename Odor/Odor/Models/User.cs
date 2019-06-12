using System.Runtime.Serialization;

namespace Odor.Models
{
    [DataContract]
    public class User
    {
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Number { get; set; }

        public string FirstName
        {
            get
            {
                return this.Name?.Split(' ')[0] ?? "";
            }
        }
    }
}