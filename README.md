# RENCI Publication Management System

A redesigned publication management for RENCI. MERN Stack(MongoDB, Express, React, Node.js) has been used in this project. The React Frontend is designed with Material UI.

## Installation & Run

### Prerequisites



First, clone the project:
```
git clone https://github.com/connectbo/Publication-Management-System-RENCI.git
```

Then, run the following commands to install the current stable release of Docker Compose and NPM.

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
    If you are a Mac user, you might need to install Docker Desktop, which is available at https://hub.docker.com/editions/community/docker-ce-desktop-mac

### Usage
After installing you can easily get project setup and running by using Docker-Compose. By this, you will only need one line command to get it running.

```
docker-compose up
```


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
