const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
const publicDir = path.resolve(__dirname + "/public/");
var fs = require("fs");

const hiddenFiles=['index.html'];

// default options
app.use(express.static(publicDir));
app.use(fileUpload());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.post("/upload", function(req, res) {
  //res.json ({success:true});
  console.log(req.files);
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  // Use the mv() method to place the file somewhere on your server
  req.files.file.mv(`${publicDir}/${req.files.file.name}`, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ success: true });
  });
});
app.get("/files", function(req, res) {
  //joining path of directory
  var directoryPath = path.join(__dirname, "public");
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function(err, files) {
    const folderInfo = fs.lstatSync(directoryPath);
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files = files
      .filter(file=>!hiddenFiles.includes(file))
      .map(file => ({
        file,
        url: `${req.protocol}://${req.hostname}${req.baseUrl}/${file}`
    }));

    res.json({ files });
  });
});



const port = 5000;
app.listen(port, () => console.log(`file server listening on port ${port}!`));
