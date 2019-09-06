using System;

namespace backend_api.Database
{
    public class RepositoryReturn<T>
    {
        public Boolean IsError { get; set; }
        
        public T ReturnValue { get; set; }

        public Exception ErrorException { get; set; }

        public RepositoryReturn( T returnValue, bool isError = false)
        {
            IsError = isError;
            ReturnValue = returnValue;
        }

        // TODO change to isError containing default true, not really necessary but nice to have
        public RepositoryReturn(bool isError, Exception errorException)
        {
            IsError = isError;
            ErrorException = errorException;
        }

    }
}