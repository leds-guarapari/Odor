using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Odor.Services
{
    public interface IDataStore<T>
    {
        Task<bool> Add(T t);
        Task<bool> Update(T t);
        Task<bool> Delete(T t);
        Task<T> Get(T t);
        Task<IEnumerable<T>> Query(T t);
        void On(T t, Action<T> action);
    }
}