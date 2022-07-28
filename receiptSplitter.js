const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const User = require('./model/user')
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://ibellero:Kenneth815!@clusterianstest.lw07g.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useNewUrlParser: true,
useUnifiedTopology: true});

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
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/register', async(req, res) =>{
    const {username, password, email, firstname, lastname} = req.body;
    client.connect(err => {
        const collection = client.db("receiptSplitter").collection("users");
        // perform actions on the collection object
        client.close();
    });
    console.log(req.body);
    res.json({status: 'ok'});
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