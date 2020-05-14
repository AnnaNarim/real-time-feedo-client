const express = require('express');
// const graphqlHTTP = require('express-graphql');
const cors = require('cors');
// const schema = require('./schema');
const path = require('path');

const app = express();

// Allow cross-origin
app.use(cors());

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true
//   })
// );

app.use(express.static('build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Client-Server started on port ${PORT}`));


// const express = require('express');
// const favicon = require('express-favicon');
// const path = require('path');
// const port = process.env.PORT || 8080;
// const app = express();
// const { Server } = require('ws');
// app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running

// app.get('/ping', function (req, res) {
//  return res.send('pong');
// });

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// app.listen(port).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

// app.use(express.static(__dirname));

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// const  WebSocket = require('ws');
// const { Server } = require('ws');

// const wss = new Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });
// const server = express()
// 	.use(express.static(path.join(__dirname, 'build')))
//   .use((req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')))


// const wss = new Server({server});

// wss.on('connection', function connection (ws) {
//   ws.on('message', function message (msg) {
//     console.log(msg);
//   });
// });

// server.listen(port, function listening () {
//     const ws = new WebSocket('wss://real-time-feedo-server.herokuapp.com');
//     ws.on('open', function open () {
//         ws.send('Workin baby');
//     });
// })

// const wss = new Server({ server: app });
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });
// server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

