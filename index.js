const express = require('express');
const fileUpload = require('express-fileupload');
const path=require('path');
const app = express();
const publicDir=path.resolve(__dirname +'/public/');
// default options
app.use(express.static(publicDir));
app.use(fileUpload());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/upload', function (req, res) {
    console.log(">>>>>>>", req.files);
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // Use the mv() method to place the file somewhere on your server
    req.files.data.mv(`${publicDir}/${req.files.data.name}`, function (err) {
        if (err) {
            console.error(err)
            return res.status(500).send(err);
        }
        res.json({ success: true });
    });
});
app.get('/', function (req, res) {
     res.sendfile(__dirname + '/index.html');
});
const port = 5000
app.listen(port, () => console.log(`file server listening on port ${port}!`))