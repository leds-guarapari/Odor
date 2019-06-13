using Odor.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Firebase.Database;
using Firebase.Database.Query;

[assembly: Xamarin.Forms.Dependency(typeof(Odor.Services.UserDataStore))]
namespace Odor.Services
{
    class UserDataStore : IDataStore<User>
    {

        private string path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Personal), "user.json");

        private FirebaseClient firebase = new FirebaseClient(Configuration.Path);

        private DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(User));

        private User user = new User();

        public UserDataStore()
        {
            try
            {
                this.user = serializer.ReadObject(File.Open(path, FileMode.OpenOrCreate)) as User;
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
        }

        public Task<bool> Add(User user)
        {
            try
            {
                /* return firebase
                    .Child("users")
                    .PostAsync(user)
                    .ContinueWith(task => {
                        user.Id = task.Result.Key;
                        this.user = user;
                        serializer.WriteObject(File.OpenWrite(path), this.user);
                        return Task.FromResult(true);
                    }).Result; */
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }

        public Task<bool> Delete(User user)
        {
            throw new NotImplementedException();
        }

        public Task<User> Get(User user)
        {
            return Task.FromResult(this.user);
        }

        public Task<IEnumerable<User>> On(User user)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(User user)
        {
            try
            {
                /* return firebase
                    .Child("users")
                    .Child(user.Id)
                    .PutAsync(user)
                    .ContinueWith(task => {
                        this.user = user;
                        serializer.WriteObject(File.OpenWrite(path), this.user);
                        return Task.FromResult(true);
                    }).Result; */
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }
    }
}
