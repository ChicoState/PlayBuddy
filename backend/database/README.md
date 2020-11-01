# Database

Playbuddy uses MongoDB for its database.
In this directory are the model files for all of the data stored.
Currently, the MongoDB database doesn't need any additional setup.
Simply running the command
`sudo docker run --name PlayBuddyDB -p 27017:27017 -d mongo`
will get a MongoDB docker container running and ready to use by the app.
