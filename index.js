const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running...`);

    for (let i = 0; i < os.cpus().length; i++) {
        console.log(`Forking process number ${i}`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} is running...`);
    const filePath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(filePath);

    const server = http.createServer(((req, res) => {
        setTimeout(() => {
            console.log(`Worker ${process.pid} handling request`);
            res.writeHead(200, 'OK', {
                'Content-Type': 'text/htm',
            });
            readStream.pipe(res);
        }, 5000);
    }));
    server.listen(5555);
}
