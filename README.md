# RENCI Publication Management System

A redesigned publication management for RENCI. MERN Stack(MongoDB, Express, React, Node.js) has been used in this project. The React Frontend is designed with Material UI.

## Installation & Run

### Clone Project
Fork and clone the repo from Github.
```
git clone https://github.com/connectbo/Publication-Management-System-RENCI.git
```

### Install Docker Compose & NPM
Run the following commands to install the current stable release of Docker Compose and NPM.

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```

Set the permissions to make the binary executable:
sudo chmod +x /usr/local/bin/docker-compose
```


```
npm install npm@latest -g
```

#### Notes for Mac User
If you are a Mac user, you might need to install Docker Desktop, which is available at
```
https://hub.docker.com/editions/community/docker-ce-desktop-mac
```

### Set up environment variable file
Create an environment variable file called .env. You can refer to the sample .env file in the root directory.

Remember to specify the API_PORT that your backend service


### Start Service
After installing you can easily get project setup and running by using Docker-Compose. By this, you will only need one line command to get two services(frontend, backend) running.

Change to your the cloned directory and then use

```
docker-compose up
```

If both frontend and backend are compiled successfully, you should be able to see the system running Port 3000 on your localhost along with the server running at Port 5000.

### Production Mode
This project also has a production ready-to-deploy version. You are able to access by
```
docker-compose -f docker-compose.prod.yml up --build
```

### Stop Service
Use the following code to stop service.
```
docker-compose down
```

### Backup and Restore
This application supports backup and restore function on the MongoDB. Use the following code to backup and restore. Notice that the publication collection will be backup from the Docker Container and its image will be stored using the name of 'db.dump' at the root directory.

Backup Command
```
docker exec mongodb sh -c 'mongodump -d test --authenticationDatabase admin -u root -p example' > db.dump
```
Restore Command
```
docker exec mongodb sh -c 'mongorestore -d test dump/test/ -u root -p example --authenticationDatabase admin' < db.dump
```



## Functionality

The homepage would list all articles already stored in RENCI's database. For those articles that are not retrieved and stored yet, you could use search and add function to store them.

### Browse all publications

By default, when you visit the homepage, you will see a list of publications stored in the RENCI database. Each publication would have a card effect, showing title and doi with a hyperlink to the external publication link. By clicking the card, you will be able to see full information, including the author, category, published date.

### Search with up to 5 metrics
You are able to search for publication in the database, with one or multiple metrics shown below:

1. DOI
2. Title
3. Author
4. Category
5. Time Period(Start date - End Date)

### Add Publication
Two options are provided to add publications into the database.

#### With DOI
Step 1: Copy and Paste the publication DOI you want to add. If you have a list of DOIs, please place each doi in a single line in the textarea provided.

Step 2: Click the 'Check' button to see if the publication of this DOI is fetchable. If not, please add manually using the second tab.

Step 3: Read through the details retrieved, see if everything is correct. Insert them into the database when you are ready.

#### Without DOI
Go to the manually-add page, enter correct publication information in these fields. Make sure the information you provide is correct. The system cannot verify its correctness.
 *Restrictions Apply.*

## Structure

```
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── config
│   ├── controllers
│   ├── models
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   ├── server.js
│   └── uploads
├── db.dump
├── docker-compose.prod.yml
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── Dockerfile-prod
    ├── build
    ├── nginx.conf
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    └── src
```

## Built With

- [Node](https://nodejs.org/) - The backend language used
- [Express](https://expressjs.com/) - The NodeJS framework used
- [React](https://reactjs.org/) - Reactive frontend framework built by Facebook
- [Material UI](https://material-ui.com/) - Material Design used
- [MongoDB](https://www.mongodb.com/) - NoSQL Database connected

## Author

* **Bo Zhou** - www.connectbo.com
