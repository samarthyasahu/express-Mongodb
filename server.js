// console.log("May Node be with you!");

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 3000;

app.set('view engine', 'ejs')

// Middleware works between '/' and (req, res) to parse the request from the POST method ans shows it
// readable format
app.use(bodyParser.urlencoded({extended:true}));

var db;

MongoClient.connect('mongodb://127.0.0.1:27017/star_wars', {
        useUnifiedTopology: true
    },(err,client) => {
    if(err) return console.error(err);
    // console.log(client);
    console.log("Connected to the Database");
    db = client.db();
});

// Routes
app.get('/', (req, res) => {
    const cursor = db.collection('quotes').find().toArray()
        .then(results => {
            // console.log(results);
            res.render('index.ejs',{quotes: results});
        });
    // console.log(cursor);
    // res.send('Get request received!');
    // console.log(__dirname +'/index.html');
});

app.post('/quotes', (req, res) => {
    const quotesCollection = db.collection('quotes');
    quotesCollection.insertOne(req.body)
        .then(result => {
            // console.log(result);
            res.redirect('/');
        })
        .catch(error => console.error(error));
    // console.log("Reached the quotes POST Routes");
    // console.log(req.body);
});

// Starting the Server
app.listen(PORT, () => {
    console.log("Server has been started.");
});