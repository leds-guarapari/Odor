using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;

namespace Odor.Services
{
    public interface IDataStore<T>
    {
        Task<bool> Add(T t);
        Task<bool> Update(T t);
        Task<bool> Delete(T t);
        Task<T> Get(T t);
        Task<IEnumerable<T>> On(T t);
    }
}