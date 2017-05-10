const path = require('path');
const fs = require('fs');

const express = require('express');
const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');

let app = express();
let multipartMiddleware = multipart();

const uploadDir = createStaticDir();

app.use(multipart({uploadDir: uploadDir}));
app.use(bodyParser());
app.use(express.static(uploadDir));


app.all('/', function (req, res) {
    let filePath = path.join(__dirname, '../index.html');
    res.sendFile(filePath);
});

app.post('/upload_0', multipartMiddleware, function (req, res) {
    console.log(req.files.file0.path);
    res.send('upload success!');
});

app.post('/upload_1', multipartMiddleware, function (req, res) {
    let filePath = req.files.file1.path;
    if (filePath) {
        result = `<script>window.top.getLoadFile('${filePath.split(/\\/).pop()}');</script>`;
        res.send(result);
    }
});

app.post('/upload_2', multipartMiddleware, function (req, res) {
    let file = req.files.files2,
        filePath;
    if (file) {
        if (isArr(file)) {
            filePath = file.map(item => item.path.split(/\\/).pop());
        } else {
            filePath = file.path.split(/\\/).pop();
        }
        res.send(filePath);
    }
});

app.post('/del', function (req, res) {
    if (req.body.delFileName) {
        fs.unlink(path.join(uploadDir, req.body.delFileName));
        res.send(req.body.delFileName)
    }
});

app.listen(8080);

console.log('server is open...');

function isArr (target) {
    return Object.prototype.toString.call(target) === '[object Array]';
}

function createStaticDir () {
    const url = path.join(__dirname, '../static');
    if (!fs.existsSync(url)) {
        fs.mkdirSync(url)
    }
    return url;
}