using Firebase.Auth;
using Firebase.Database;
using Firebase.Database.Query;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

[assembly: Xamarin.Forms.Dependency(typeof(Odor.Services.OdorDataStore))]
namespace Odor.Services
{
    /*
     *
     * A class that inherits from the IDataStore interface to persist odor objects.
     * 
     */
    /// <summary>
    /// A class that inherits from the IDataStore interface to persist odor objects.
    /// </summary>
    class OdorDataStore : IDataStore<Models.Odor>
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
        public Task<bool> Add(Models.Odor odor)
        {
            try
            {
                return this.Firebase
                    .Child("odors")
                    .PostAsync(odor)
                    .ContinueWith(task =>
                    {
                        odor.Id = task.Result.Key;
                        return task.IsCompleted;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(false);
        }
        public Task<bool> Update(Models.Odor odor)
        {
            try
            {
                return this.Firebase
                    .Child("odors")
                    .Child(odor.Id)
                    .PutAsync(new Models.Odor
                    {
                        UserId = odor.UserId,
                        UserName = odor.UserName,
                        UserType = odor.UserType,
                        UserOrigin = odor.UserOrigin,
                        Intensity = odor.Intensity,
                        Nuisance = odor.Nuisance,
                        Type = odor.Type,
                        Origin = odor.Origin,
                        Address = odor.Address,
                        Latitude = odor.Latitude,
                        Longitude = odor.Longitude,
                        Date = odor.Date,
                        Begin = odor.Begin,
                        End = odor.End
                    })
                    .ContinueWith(task =>
                    {
                        return task.IsCompleted;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(false);
        }
        public Task<bool> Delete(Models.Odor odor)
        {
            try
            {
                return this.Firebase
                    .Child("odors")
                    .Child(odor.Id)
                    .DeleteAsync()
                    .ContinueWith(task =>
                    {
                        return task.IsCompleted;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(false);
        }
        public Task<Models.Odor> Get(Models.Odor odor)
        {
            try
            {
                return this.Firebase
                    .Child("odors")
                    .Child(odor.Id)
                    .OnceAsync<Models.Odor>()
                    .ContinueWith(task =>
                    {
                        var result = task.Result.Last();
                        Models.Odor Odor = result.Object;
                        Odor.Id = result.Key;
                        return Odor;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(odor);
        }
        public Task<IEnumerable<Models.Odor>> Query(Models.Odor odor)
        {
            IEnumerable<Models.Odor> odors = new List<Models.Odor>();
            try
            {
                return this.Firebase
                    .Child("odors")
                    .OrderBy("UserId")
                    .EqualTo(odor.UserId)
                    .OnceAsync<Models.Odor>()
                    .ContinueWith(task =>
                    {
                        foreach (var result in task.Result)
                        {
                            Models.Odor Odor = result.Object;
                            Odor.Id = result.Key;
                            ((List<Models.Odor>)odors).Add(Odor);
                        }
                        return odors;
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
            return Task.FromResult(odors);
        }
        public void On(Models.Odor odor, Action<Models.Odor> action)
        {
            try
            {
                this.Firebase
                    .Child("odors")
                    .OrderBy("UserId")
                    .EqualTo(odor.UserId)
                    .AsObservable<Models.Odor>()
                    .Subscribe(result =>
                    {
                        Models.Odor Odor = result.Object;
                        Odor.Id = result.Key;
                        action(Odor);
                    });
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }
        }
    }
}