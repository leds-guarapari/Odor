using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Linq;
using Firebase.Database;
using Firebase.Database.Query;

[assembly: Xamarin.Forms.Dependency(typeof(Odor.Services.OdorDataStore))]
namespace Odor.Services
{
    class OdorDataStore : IDataStore<Models.Odor>
    {
        private readonly FirebaseClient Firebase = new FirebaseClient(ConfigurationManager.Configuration.FirebaseRealtimeDatabasePath);
        public Task<bool> Add(Models.Odor odor)
        {
            try
            {
                this.Firebase
                    .Child("odors")
                    .PostAsync(odor)
                    .ContinueWith(task => {
                        odor.Id = task.Result.Key;
                    });
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }
        public Task<bool> Update(Models.Odor odor)
        {
            try
            {
                this.Firebase
                    .Child("odors")
                    .Child(odor.Id)
                    .PutAsync(new Models.Odor
                    {
                        UserId = odor.UserId,
                        Intensity = odor.Intensity,
                        Latitude = odor.Latitude,
                        Longitude = odor.Longitude,
                        Address = odor.Address,
                        Location = odor.Location,
                        Type = odor.Type,
                        Date = odor.Date,
                        Begin = odor.Begin,
                        End = odor.End
                    });
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }
        public Task<bool> Delete(Models.Odor odor)
        {
            try
            {
                this.Firebase
                    .Child("odors")
                    .Child(odor.Id)
                    .DeleteAsync();
                return Task.FromResult(true);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(false);
            }
        }
        public Task<Models.Odor> Get(Models.Odor odor)
        {
            try
            {
                var result = this.Firebase
                    .Child("odors")
                    .Child(odor.Id)
                    .OnceAsync<Models.Odor>()
                    .Result
                    .Last();
                Models.Odor Odor = result.Object;
                Odor.Id = result.Key;
                return Task.FromResult(Odor);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
                return Task.FromResult(odor);
            }
        }
        public Task<IEnumerable<Models.Odor>> Query(Models.Odor odor)
        {
            IEnumerable<Models.Odor> odors = new List<Models.Odor>();
            try
            {
                var results = this.Firebase
                    .Child("odors")
                    .OrderBy("UserId")
                    .EqualTo(odor.UserId)
                    .OnceAsync<Models.Odor>()
                    .Result;
                foreach (var result in results)
                {
                    Models.Odor Odor = result.Object;
                    Odor.Id = result.Key;
                    ((List<Models.Odor>) odors).Add(Odor);
                }
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
                var observable = this.Firebase
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