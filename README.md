<p align="center">
 <img width=200px height=200px src="./readme.png" alt="Project logo">
</p>

<h3 align="center">Bate Papo UOL API</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-closed-red.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/raferdev/batepapo-uol-api.svg)](https://github.com//raferdev/batepapo-uol-api/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/raferdev/batepapo-uol-api/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> 

This is a backend project without complex architeture, its created to serve the frontend project which you can see <a href="https://github.com/raferdev/batepapo-uol">here</a>, and its a pratice into express world using middlewares, JOI to verify schemas and more. 
</p>

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

---

## 🧐 About <a name = "about"></a>

This project is used to generate one simple online chat, which store participants, messages and logs. It's serve the <a href="https://github.com/raferdev/batepapo-uol">frontend</a> and can verify the body of requests to maintain the business rules.

---

## 🏁 Getting Started <a name = "getting_started"></a>

You can clone the project and start on your local host like below.

### Prerequisites
You need install ***GIT*** if you don't already have, to clone project,.

<a href="https://git-scm.com/downloads">Click here</a> or Acess: 

```
https://git-scm.com/downloads
```


You need install ***Docker*** on your machine if you don't already have.

<a href="https://docs.docker.com/get-docker">Click here</a> or Acess: 
```
https://docs.docker.com/get-docker/
```
And use the step-by-step doc to download and install on your specific system.

### Installing

1 - Clone on your local system

 ```
 git clone https://github.com/raferdev/batepapo-uol-api
 ```

2 - Go to project path 

```
cd batepapo-uol-api
```

3 - Create env file

You can rename the ".env.exemple" file to ".env", just removing ".exemple" and save, or follow this steps to create new one:

- Open a text editor or other editor do you prefeer, create this variables like below and save file with name '.env'.


 ```
MONGO_URI=mongodb://mongodb:27017/
PORT_HOST=5000
```
You can change the values of variables if you want or need.

### Start

Use on terminal:
```
npm run start
```
*The attached console will show "Hello i'm running on port = (PORT)" and after some mongodb logs.*

---
## 🎈 Usage <a name="usage"></a>

Now you will need one tool to make requests and interact whith your API. Some famous API Clients are <a href="https://insomnia.rest/download">Insomnia</a>, <a href="https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client">Thunder CLient</a> to VSCode users, <a href="https://www.postman.com/">Postman</a> and many others, like browsers plugins. If you dont use to complex jobs any of these will help you.

- **GUIDE** : 

    **HTTP METHOD** - */route* -  Little description of it behaviour.

  ```
    Received or sended object schema.
    Ex: {
    "text":"Lorem ipsum..."
    }
  ```
  *Final thoughts about API behaviour*

  ---
  Exemple:

  **GET** - */health* - API return status 200 with object below.
  ```
  {
    "message":"I'm Alive!"
  }
  ```
  Simple way to verify if API is up. *Maybe is not implemented on this project*
  
  ---
  **Usage** - In this case you will make a GET request on http://localhost:5000/health. And will receive the JSON object "message: I'm Alive!" on the console, terminal or display, depending on the case.
  
  ---

**LET'S GO** - API description.

**POST** - */participants* - API verify existing users online with same name and, if don't have, includes user on mongoDB.

```
  {
  "name":""
  }
```
This route have setTimeout to verify activity, if user frontend dont send new requests in 10 seconds, this user are removed.

**GET** - */participants* - API return one array with online users.
```
  [{
   "name":"john"
  },{
   "name":"will"
  },...]
```
**POST** - */messages* - Send message to API redirect for one user or all chat.

HEADER:
```
{
  "user":""
}
```
 BODY:
```
{
  "to":"",
  "text":"",
  "type":""
}
```
Valid types: ["message", "private_message"].

"message": all users can see on chat.

"private_message": only the one user you sended.

**PUT** - */messages/:message_id* - User can edit the message, need id from mongoDB.

```
{
  "to":"",
  "text":"",
  "type":""
}
```


---

## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJS](https://nodejs.org/en/docs/) - Backend Language
- [Express](https://expressjs.com/pt-br/) - Node Framework
- [Docker](https://www.docker.com/) - Container Technology


---
## ✍️ Authors <a name = "authors"></a>

- [@raferdev](https://github.com/raferdev)
