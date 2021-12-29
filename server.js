const http = require('http');
const path = require('path');
const fs = require('fs');

(async () => {
    const isFile = (path) => fs.lstatSync(path).isFile();

    http.createServer( (req, res) => {
        const contentPath = path.join(process.cwd(), req.url);
        console.log(contentPath);
        if (!fs.existsSync(contentPath)) return res.end('No such directory or file');

        if (isFile(contentPath)) {
            return fs.createReadStream(contentPath).pipe(res);
        }

        let contentList = '';

        fs.readdirSync(contentPath)
            .forEach(fileName => {
                const filePath = path.join(req.url, fileName);
                contentList += `<div><a href="${filePath}">${fileName}</a></div>`;
            });
        const HTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8').replace('Content', contentList);
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        return res.end(HTML);
    }).listen(3000, 'localhost');
})();
