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


## Functionality

The homepage would list all articles already stored in RENCI's database. For those articles that are not retrieved and stored yet, you could use search and add function to store them.

### Browse all publications

By default, when you visit the homepage, you will see a list of publications stored in the RENCI database. Each publication would have a card effect, showing title and doi with a hyperlink to the external publication link. By clicking the card, you will be able to see full information, including the author, category, published date.

### Search with DOI
You are able to search publications stored in RENCI database by one of the following category, a combination or all of them.

1. DOI
2. Title
3. Author
4. Category
5. Start Date
6. End Date

###

## Structure

```
.
├── README.md
├── backend                                                 ## Express Backend Server
│   ├── Dockerfile
│   ├── config
│   │   ├── db.js                                           ## Connection with MongoDB
│   │   └── default.json
│   ├── controllers                                         
│   │   └── publication_controller.js
│   ├── models
│   │   └── publication
│   │       └── schema.js                                  
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   └── publication_router.js
│   └── server.js                                           
├── docker-compose.yml
└── frontend                                                ## React Frontend Framework
    ├── Dockerfile
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   └── manifest.json
    └── src
        ├── App.js
        ├── App.test.js
        ├── components                                      
        │   ├── Header.js
        │   ├── Home.js
        │   └── Search.js
        ├── img
        │   ├── RENCI\ Appbar.tiff
        │   └── RENCI-Appbar.jpg
        ├── index.css
        ├── index.js
        ├── logo.svg
        └── serviceWorker.js
```

## Built With

- [Node](https://nodejs.org/) - The backend language used
- [Express](https://expressjs.com/) - The NodeJS framework used
- [React](https://reactjs.org/) - Reactive frontend framework built by Facebook
- [Material UI](https://material-ui.com/) - Material Design used
- [MongoDB](https://www.mongodb.com/) - NoSQL Database connected

## Author

* **Bo Zhou** - www.connectbo.com
