const server = require('./server');
const mode = process.env.MODE || 'production'
console.log(mode)
server.start(mode);