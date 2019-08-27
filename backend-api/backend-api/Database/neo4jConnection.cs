using System.Configuration;
using Neo4j.Driver.V1;

namespace backend_api.Database
{
    public class neo4jConnection
    {
        private readonly string _databaseUrl;
        private readonly string _dbUser;
        private readonly string _dbPw;

        public IDriver driver;


        public neo4jConnection()
        {
            _databaseUrl = ConfigurationManager.AppSettings["databaseURL"];
            _dbUser = ConfigurationManager.AppSettings["databaseUsername"];
            _dbPw = ConfigurationManager.AppSettings["databasePassword"];
            
            driver = GraphDatabase.Driver(_databaseUrl, AuthTokens.Basic(_dbUser, _dbPw));
        }
    }
}