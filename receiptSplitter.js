const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const { createWorker } = require('tesseract.js');
// var worker = createWorker({
//     logger: m => console.log(m),
//   });

//Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req,file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage}).single('receipt');

app.set('view engine', "ejs");
app.use(express.static("public"));

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        fs.readFile('./uploads/' + req.file.originalname, (err, data) => {
            if(err) return console.log("This is you error" , err);

            var worker = createWorker({
                logger: m => console.log(m),
              });

            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(data);
                console.log(text);
                res.send(text);
                await worker.terminate();
              })();
        });
    });
});

//Sart Server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log('Running on port ' + PORT));

app.get('/upload', (req,res) => {

})