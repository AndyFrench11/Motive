using System;

namespace backend_api.Util
{
    public class ValidationUtil
    {
        public ValidationUtil()
        {
        }
        
        /**
         * Attempts to parse a given string into a Guid.
         * If the given string is null or cannot be formatted, returns a read only empty guid.
         */
        public static Guid ParseGuid(string id)
        {
            Guid newGuid;
            try
            {
                newGuid = Guid.Parse(id);
            }
            catch (ArgumentNullException)
            {
                return Guid.Empty;
            }
            catch (FormatException)
            {
                return Guid.Empty;
            }

            return newGuid;
        }
    }
}