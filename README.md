# Motive.    :gorilla:

A passion project social media platform that allows people to share and collaborate on their passion, knowing their data is secure and their privacy is respected.

## File Structure

* `/backend-api` - ASP.NET Back-end API Project.
* `/backend-tests` - Back-end Testing Project in xUnit.
* `/frontend-web` - React/Redux Front-end Project.
* `.gitlab-ci.yml` - Master Continuous Integration File to run all pipelines, speaking to Virtual Machine at `csse-s402g2.canterbury.ac.nz`.
* `docker-compose.yml` - Docker build file which speaks to each projects docker file to enable containerisation of each project.

## Backend API :back: :end: 

#### Location   
`/backend-api`

#### Dependencies
[.NET Core Runtime 2.2](https://dotnet.microsoft.com/download)    
[.NET Framework 4](https://dotnet.microsoft.com/download/dotnet-framework)   
[NuGet ASP.NET MVC Package](https://www.nuget.org/packages/Microsoft.AspNet.Mvc/)   
[Visual Studio](https://visualstudio.microsoft.com/downloads/) (not Visual Studio Code) or [Rider (JetBrains)](https://www.jetbrains.com/rider/download/)    

#### How to run the program   

- Option 1: Visual Studio/Rider   
Open up the solution file (.sln) in either of these IDEs and the backend can be ran from there.  
Both Visual Studio and Rider come with the ability to read the solution file and prepare the runtime to be able to run the back-end.   
By pressing the 'Run' button, using the kestrel server, and this will start the application running on the 8081 port.

   
- Option 2: Command Line   
This requires navigating into the `/backend-api/backend-api`.   
From there, run the `dotnet run` command.   
This will start the application running on the 8081 port.

#### Configuration
Navigate to App.config inside `backend-api/backend-api`.   
Running locally:  
- Set backend key `databaseURL` to value `bolt://localhost:7687`   
- Set backend key `databaseHttpURL` to value `http://localhost:7474`   

Running on VM:   
- Set backend key `databaseURL` to value `bolt://csse-s402g2.canterbury.ac.nz:7687`    
- Set backend key `databaseHttpURL` to value `http://csse-s402g2.canterbury.ac.nz:7474`   

## Web Frontend :bullettrain\_front: :end:

#### Location   
`/frontend-web`

#### Dependencies
[Node.js Runtime](https://nodejs.org/en/)   
[Yarn](https://yarnpkg.com/lang/en/)   

#### How to run the program
From inside `/frontend-web`:   
`yarn install`   
`yarn start`   

#### Configuration
In `.env`, set the `REACT_APP_BACKEND_ADDRESS` to be:   
- Running locally: `https://localhost:8081/api`   
- Running on the VM: `http://csse-s402g2.canterbury.ac.nz:8080/api`   

## Neo4j Database :1234:  

#### Dependencies
[Neo4j Community 3.5](https://neo4j.com/download-center/#community)

#### How to run the program   

After having downloaded Neo4j, navigate to `/neo4j-community-3.5.x` and run `./bin/neo4j console`.    
This starts the database on the bolt port 7687, and then the browser view is on 7474.

#### Configuration    
If you wish to add any other configuration, navigate to the `./conf/neo4j.conf` file.