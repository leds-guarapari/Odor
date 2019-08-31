using Firebase.Auth;
using Firebase.Database;
using Firebase.Database.Query;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

[assembly: Xamarin.Forms.Dependency(typeof(Odor.Services.UserDataStore))]
namespace Odor.Services
{
    /*
     *
     * A class that inherits from the IDataStore interface to persist user objects.
     * 
     */
    /// <summary>
    /// A class that inherits from the IDataStore interface to persist user objects.
    /// </summary>
    class UserDataStore : IDataStore<Models.User>
    {
        /// <value>Using Firebase Database API.</value>
        private readonly FirebaseClient Firebase = new FirebaseClient(
            ConfigurationManager.Configuration.FirebaseRealtimeDatabasePath,
            new FirebaseOptions
            {
                AuthTokenAsyncFactory = () =>
                    (new FirebaseAuthProvider(new FirebaseConfig(ConfigurationManager.Configuration.FirebaseAPIKey)))
                    .SignInWithEmailAndPasswordAsync(ConfigurationManager.Configuration.FirebaseUser,
                                                     ConfigurationManager.Configuration.FirebasePassword)
                    .ContinueWith(task => { return task.Result.FirebaseToken; })

            });
        /// <value>Using local device storage.</value>
        private readonly string File = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), ConfigurationManager.Configuration.UserFile);
        /// <value>Gets empty user.</value>
        private Models.User user = new Models.User();
        public Task<bool> Add(Models.User user)
        {
            try
            {
                return this.Firebase
                    .Child("users")
                    .PostAsync(user)
                    .ContinueWith((Task<FirebaseObject<Models.User>> task) =>
                    {
                        user.Id = task.Result.Key;
                        this.user = user;
                        try
                        {
                            System.IO.File.WriteAllText(this.File, JsonConvert.SerializeObject(this.user, Formatting.Indented));
                            return task.IsCompleted;
                        }
                        catch (Exception exception)
                        {
                            Debug.WriteLine(exception);
                        }
                        return false;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(false);
        }
        public Task<bool> Update(Models.User user)
        {
            try
            {
                return this.Firebase
                    .Child("users")
                    .Child(user.Id)
                    .PutAsync(new Models.User
                    {
                        Name = user.Name,
                        Number = user.Number,
                        Address = user.Address
                    })
                    .ContinueWith(task =>
                    {
                        this.user = user;
                        try
                        {
                            System.IO.File.WriteAllText(this.File, JsonConvert.SerializeObject(this.user, Formatting.Indented));
                            return task.IsCompleted;
                        }
                        catch (Exception exception)
                        {
                            Debug.WriteLine(exception);
                        }
                        return false;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(false);
        }
        public Task<bool> Delete(Models.User user)
        {
            throw new NotImplementedException();
        }
        public Task<Models.User> Get(Models.User user)
        {
            try
            {
                this.user = JsonConvert.DeserializeObject<Models.User>(System.IO.File.ReadAllText(this.File));
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