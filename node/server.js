'use strict';

const express = require('express');

// Constants
let PORT = 8080;
const HOST = '0.0.0.0';

if(process.env.PORT){
  PORT = parseInt(process.env.PORT);
}

let nodeName = 'default-node';

if(process.env.NODE_NAME){
  nodeName = process.env.NODE_NAME;
}

// App
const app = express();
app.get('/', (req, res) => {
  res.send(`\nHello World from ${nodeName}\n`);
});

app.listen(PORT, HOST);
console.log(`Running node ${nodeName} on http://${HOST}:${PORT}`);
