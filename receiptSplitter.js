const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const User = require('./model/user');
const Event = require('./model/event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const uri = "mongodb+srv://ibellero:Kenneth@clusterianstest.lw07g.mongodb.net/?retryWrites=true&w=majority";
const JWT_SECRET = 'bwoeufov2@348q3@4trpqt80234o$9q34vpq3_0n4aclf38&^49q3vp4bvsergtvqw39453423vvvfsws';
mongoose.connect(uri, {useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'receiptSplitter'
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
app.use(express.static("public"));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/home', (req, res) => {
    res.render("home");
});

app.get('/newReceipt', (req, res) => {
    res.render("newReceipt");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/eventInfo', async (req, res) => {
    const {token} = req.body;

    try{
        const user = jwt.verify(token, JWT_SECRET);

        const _id = user.id;

        const userInfo = await User.findOne({_id}).lean();

        var eventInfoArray = [];

        for(let i = 0; i < userInfo.splitReceiptList.length; i++){
            var eventInfo = await Event.findById(userInfo.splitReceiptList[i].id).lean();
            eventInfoArray.push({name: eventInfo.name, date: eventInfo.date, action: eventInfo.action});
        }

        return res.json({status: 'ok', data: eventInfoArray});

    }catch(error){
        throw error;
    }
});

app.post('/userHomeInfo', async (req, res) => {
    const {token} = req.body;
    try{
        const user = jwt.verify(token, JWT_SECRET);

        const _id = user.id;

        const userInfo = await User.findOne({_id}).lean();

        return res.json({status: 'ok', data: {firstname: userInfo.firstname, lastname: userInfo.lastname}});
    } catch(error){

    }
});

// app.post('changePassword', async (req, res) => {
//     const {token} = req.body;
//     try{
//         const user = jwt.verify(token, JWT_SECRET);

//         const _id = user.id;

//         const userInfo = await User.findOne({_id}).lean();

//         return res.json({status: 'ok', data: {firstname: userInfo.firstname, lastname: userInfo.userInfo}});
//     } catch(error){

//     }
// })

app.post('/logUserIn', async (req, res) => {

    const {username, password} = req.body;

    // find user
    const user = await User.findOne({username}).lean();

    if(!user){
        return res.json({status: 'error', error: 'The username or password is not correct'});
    }
    // check hashed password to match with usernames password

    if (await bcrypt.compare(password, (await user).password)){
        const token = jwt.sign({
            id: (await user)._id,
            username: (await user).username},
            JWT_SECRET
        );

        console.log(token);
        return res.json({status: 'ok', data: token});
    }

    return res.json({status: 'error', error: 'The username or password is not correct'});
});

app.post('/addEvent', async(req, res) => {
    const {name, date, friends, itemsList, tip, tax, total, action, token} = req.body;

    const user = jwt.verify(token, JWT_SECRET);

    const decoded_jwt = jwt_decode(token);
    const currentUsername = decoded_jwt.username;

    friends.push(currentUsername);

    try {
        const response = await Event.create({
            name,
            date,
            friends,
            itemsList,
            tip,
            tax,
            total,
            action
        });

        const id = response._id;

        // find users and add event
        for(let i = 0; i < friends.length; i++){
            const currentUser = await User.updateOne(
                {username: friends[i]},
                {$push: {splitReceiptList: { id }}}
            );
        }

    } catch(error){
        throw error;
    }
    // console.log(response);

    console.log(token);

    res.json({status: 'ok'});
    console.log(req.body);
});

app.post('/register', async(req, res) =>{
    const {username, password: plainTextPassword, email, firstname, lastname} = req.body;
    
    const password = await bcrypt.hash(plainTextPassword, 10);

    try{
        const response = await User.create({
            username,
            password,
            email,
            firstname,
            lastname
        });
        console.log('register');
    } catch(error){
        if (error.code === 11000){
            return res.json({status: 'error', error: 'Username or email already in use'})
        }
        throw error;
    }

    res.json({status: 'ok'});
    console.log(req.body);
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