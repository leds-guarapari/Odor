using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Odor.Services
{
    /*
     *
     * Default data store interface methods.
     * 
     */
    /// <summary>
    /// Default data store interface methods.
    /// </summary>
    /// <typeparam name="T">A type from the classes of models.</typeparam>
    public interface IDataStore<T>
    {
        /// <summary>
        /// Method to add an object in data store.
        /// </summary>
        /// <returns>
        /// If object is added in data store.
        /// </returns>
        Task<bool> Add(T t);
        /// <summary>
        /// Method to update an object in data store.
        /// </summary>
        /// <returns>
        /// If object is updated in data store.
        /// </returns>
        Task<bool> Update(T t);
        /// <summary>
        /// Method to delete an object in data store.
        /// </summary>
        /// <returns>
        /// If object is deleted in data store.
        /// </returns>
        Task<bool> Delete(T t);
        /// <summary>
        /// Method to get an object in data store.
        /// </summary>
        /// <returns>
        /// The object getted by data store.
        /// </returns>
        Task<T> Get(T t);
        /// <summary>
        /// Method to search objects in data store.
        /// </summary>
        /// <returns>
        /// The objects collection searched by data store.
        /// </returns>
        Task<IEnumerable<T>> Query(T t);
        /// <summary>
        /// Method to execute action parameter when to listen an observable object in data store.
        /// </summary>
        void On(T t, Action<T> action);
    }
}