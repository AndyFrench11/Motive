using System;
using Neo4jClient;
using System.Configuration;
using Neo4j.Driver.V1;

namespace backend_api.Database
{
    public class neo4jClient
    {
        private readonly string _databaseUrl;
        private readonly string _dbUser;
        private readonly string _dbPw;

        public GraphClient client;


        public neo4jClient()
        {
            _databaseUrl = ConfigurationManager.AppSettings["databaseHttpURL"];
            _dbUser = ConfigurationManager.AppSettings["databaseUsername"];
            _dbPw = ConfigurationManager.AppSettings["databasePassword"];
            
            client = new GraphClient(new Uri(_databaseUrl + "/db/data"), _dbUser, _dbPw);
            
        }
    }
}