const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
// default options
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
    req.files.fileData.mv('public/' + req.files.fileData.name, function (err) {
        if (err) {
            console.error(err)
            return res.status(500).send(err);
        }
        res.json({ success: true });
    });
});
const port = 5000
app.listen(port, () => console.log(`file server listening on port ${port}!`))