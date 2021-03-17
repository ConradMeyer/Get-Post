// 1) ------ Importar dependencias ------
const express = require('express');

// ------ FIREBASE ------
const admin = require("firebase-admin");

const serviceAccount = require("/Users/CONRAD/Documents/The_Bridge/Back-end/Semana 1/get-post/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://expressserverjs-default-rtdb.europe-west1.firebasedatabase.app"
});

const dataB = admin.database();

// 2) ------ Configuración inicial ------
const server = express();
const listenPort = 8080;

// Folder with my frontend app
const staticFilesPath = express.static(__dirname + '/public');
server.use(staticFilesPath);

// JSON support
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// -------------- API REST --------------
let position = 0;

server.get('/dameUnaPalabra', (req, res) => {
  dataB.ref('mensajes/').once('value', response => {
    res.send(response.val())
    let data = response.val()
    position = data.length
  })
});

server.post('/tomaUnaPalabra', async(req, res) => {
  await dataB.ref('mensajes/' + position).set(req.body.text)
  position++
  dataB.ref('mensajes/').once('value', response => {
  res.send(response.val())}
  )}
);

server.put('/cambiaUnaPalabra', async (req, res) => {

  await dataB.ref('mensajes/' + req.body.id).set(req.body.text)
  
  dataB.ref('mensajes/').once('value', response => {
    res.send(response.val())}
    )
})

server.delete('/borraUnaPalabra', async (req, res) => {
  await dataB.ref('mensajes/' + req.body.id).remove()
  
  dataB.ref('mensajes/').once('value', response => {
    res.send(response.val())}
    )
})



// PUT MONSTER (w/ async/await)
server.put('/monsters', async (req, res) => {
  let body = req.body;
  let params = req.query; // Query strings example

  // Cambiar el nombre de aquel elemento referenciado por el myId
  // ... Validations ...
  await firebase.database().ref('mensajes/' + params.myId).update({
    name: body.name
  })

  res.send("Todo bien");
});

// DELETE MONSTER (w/ async/await)
server.delete('/monsters/:myId', async (req, res) => {
  let params = req.params; // Query params example
  
  // Borrrar aquel elemento referenciado por el myId
  // ... Validations ...
  await firebase.database().ref('monsters/' + params.myId).remove()

  res.send("Todo bien");
});

// ...
server.listen(listenPort,
  () => console.log(`Server started listening on ${listenPort}`)
);