using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Firebase.Database;
using Firebase.Database.Query;
using Newtonsoft.Json;

[assembly: Xamarin.Forms.Dependency(typeof(Odor.Services.UserDataStore))]
namespace Odor.Services
{
    class UserDataStore : IDataStore<Models.User>
    {
        private readonly FirebaseClient firebase = new FirebaseClient(Configuration.Path);

        private Models.User user = new Models.User();
        public Task<bool> Add(Models.User user)
        {
            try
            {
                firebase
                    .Child("users")
                    .PostAsync(user)
                    .ContinueWith(task => {
                        user.Id = task.Result.Key;
                        this.user = user;
                        File.WriteAllText(Path.Combine(
                            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), Configuration.File),
                            JsonConvert.SerializeObject(this.user, Formatting.Indented));
                    });
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }
        public Task<bool> Update(Models.User user)
        {
            try
            {
                firebase
                    .Child("users")
                    .Child(user.Id)
                    .PutAsync(new Models.User
                    {
                        Name = user.Name,
                        Number = user.Number
                    })
                    .ContinueWith(task => {
                        this.user = user;
                        File.WriteAllText(Path.Combine(
                            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), Configuration.File),
                            JsonConvert.SerializeObject(this.user, Formatting.Indented));
                    });
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }
        public Task<bool> Delete(Models.User user)
        {
            throw new NotImplementedException();
        }
        public Task<Models.User> Get(Models.User user)
        {
            try
            {
                this.user = JsonConvert.DeserializeObject<Models.User>(
                    File.ReadAllText(Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), Configuration.File)));
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(this.user);
        }
        public Task<IEnumerable<Models.User>> Query(Models.User user)
        {
            throw new NotImplementedException();
        }
        public void On(Models.User user, Action<Models.User> action)
        {
            throw new NotImplementedException();
        }
    }
}