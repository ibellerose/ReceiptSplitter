const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const worker = createWorker({
    logger: m => console.log(m),
  });

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

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        fs.readFile('./uploads/' + req.file.originalname, (err, data) => {
            if(err) return console.log("This is you error" , err);

            // worker
            //     .recognize(data, "eng" )
            //     // .progress(progress => {
            //     //     console.log(progress);
            //     // })
            //     .then(result => {
            //         res.send(result.text);
            //     })
            //     .finally(() => worker.terminate());

            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(data);
                console.log(text);
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