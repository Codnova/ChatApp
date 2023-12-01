// Imports

import express from "express";
import {router as routerViews} from "./routes/routes.views.js";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./utils.js"
import {join} from "path";

// Definitions

const publicFolder = join(__dirname, "/public");
const viewFolder = join(__dirname, "/views");
const app = express();
const PORT = 3000;
const server = app.listen(PORT, ()=>{
  console.log("Server is running on PORT: ", PORT);
})
export const io = new Server(server);


// Methods

app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.engine("handlebars", engine()); //Handlebar engine init
app.set("view engine", "handlebars") 
app.set("views", viewFolder) //We specify where the views folder is
app.use(express.static(publicFolder))//Tell express where the public folder is
app.use('/', routerViews); //Router Views init

// Init

let users = [];
let messages = [];

io.on('connection', (socket)=> {

  console.log("Se ha conectado un cliente con ID: ", socket.id);
  
  socket.on('login', (name)=>{
    console.log("The user with the following ID has logged in: ", name);
    socket.broadcast.emit("newUser", name); //We broadcast to everyone (except the sender), that a user has logged in
    users.push(name);
    console.log(users)
  })

  socket.on ('message', (messageObj)=>{
    console.log(`The user ${messageObj.sender} sent the following message: ${messageObj.message}`);
    io.emit("newMessage", messageObj);//We send the message to everyone connected to the server
    messages.push(messageObj); //We record all the messages into memory
    console.log(messages);
  })

})


