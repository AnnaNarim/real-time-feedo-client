const express = require('express');
// const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
// const app = express();
// const { Server } = require('ws');
// app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/ping', function (req, res) {
//  return res.send('pong');
// });

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// app.listen(port).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

const server = express()
  .use((req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')))
  .listen(port, () => console.log(`Listening on ${port}`))
	.then(({ url }) => {
	  console.log(`🚀 Server ready at ${url}`);
	});

const { Server } = require('ws');

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});
// const wss = new Server({ server: app });
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });
// server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

