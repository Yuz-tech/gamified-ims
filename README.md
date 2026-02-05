PROJECT TITLE: Gamified IMS Awareness Training
As the title implies, it is a gamified version of the yearly IMS Awareness Training
-This proposed project comes with the following set of instructions that is need to run the system

PRE-REQUISITES
1. Install Node.JS (recommended version 20.17.0 or LTS versions)
2. Install MongoDB (recommended but can change to SQL when opted)
3. Install GIT (for version controls)

PROJECT STRUCTURE =>
GAMIFIED-IMS 
backend
-config
-models
-routes
-server.js
-.env
frontend

======BACKEND SETUP=======
1. cd backend
2. npm init -y
3. npm install express cors dotenv bcryptjs jsonwebtoken
4. npm install express-validator mongoose
5. npm install nodemon --save-dev
6. go to ".env" then enter the following:
PORT=5000
MONGODB_URI=mongodb://<server ip>:27017/
JWT_SECRET=super_secret
NODE_ENV=development
7. go to package.json, modify the following:
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}

========FRONTEND SETUP========
1. cd frontend
2. npx create-react-app . 
NOTE: react install might take a while...I mean a WHILE
3. npm install axios
4. npm install react-dom
5. npm install react-router-dom
6. npm install react-scripts
7. npm install bootstrap
8. npm install react-bootstrap

=======CONNECTION LOCAL SETUP=======
1. Install MongoDB
2. Add MongoDB to System Path (SYSTEM ENVIRONMENT VARIABLES -> New Path %bin of MongoDB)
3. Install MongoDB compass
4. Using compass, create new connection
*IMPORTANT: CONNECTION MUST BE THE SAME WITH .ENV MONGODB_URI

========INITIAL CODES========
1. cd backend
2. create the Server.js, config/db.js, and routes/auth.js