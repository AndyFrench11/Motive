# Motive.

A passion project social media platform that allows people to share and collaborate on their passion, knowing their data is secure and their privacy is respected.

## File Structure

* `backend-api` - ASP.NET Back-end API Project.
* `backend-tests` - Back-end Testing Project in xUnit.
* `frontend-web` - React/Redux Front-end Project.
* `.gitlab-ci.yml` - Master Continuous Integration File to run all pipelines, speaking to Virtual Machine at `csse-s402g2.canterbury.ac.nz`.
* `docker-compose.yml` - Docker build file which speaks to each projects docker file to enable containerisation of each project.

### Backend API

#### Dependencies

#### How to run the program

#### Configuration

### Backend Tests

#### Dependencies

#### How to run the program

#### Configuration

### Web Frontend

#### Dependencies

#### How to run the program

#### Configuration

DESKTOP CLIENT

Dependencies:
Oracle Java Runtime Environment at least version 8
Read and write permissions on the folder the jar file is in

How to run the program:
Navigate a shell (cmd or bash) to the same directory of the jar file, and then execute the command "java -jar desktopClient-1.0-SNAPSHOT.jar"  

Configuration:
After the jar file has been run, it will create client_config.txt in the folder it was run from.
You can edit this file to set the address of the server the desktop client will connect to next time it is run.
For example, to connect to a server instance on the same computer, set line 4 to "server=https://localhost:7015/api/v1"

MOBILE CLIENT  

Dependencies:
Android 4.3 (API 18) or higher
Storage and Map Permisions.  

How to install:
Navigate to http://csse-s302g3.canterbury.ac.nz/ on browser and download the releases.apk file.
Install to an android device of version 4.3 (API 18) or higher
App should be in the device app list.  

SERVER

Dependencies:
Oracle Java Runtime Environment at least version 8
Read and write permissions on the folder the jar file is in

How to run the program:
Navigate a shell (cmd or bash) to the same directory of the jar file, and then execute the command "java -jar server-1.0-SNAPSHOT.jar"  

Configuration:
The server always hosts on port 7015.
After the jar file has been run, it will create server_config.txt in the folder it was run from.
You can edit this file to set the details of the database the server will connect to next time it is run.

