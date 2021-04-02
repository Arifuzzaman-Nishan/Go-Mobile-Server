const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID
const app = express()
const port = 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.furzf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    // for new data insert
    const newMobileCollection = client.db("goMobile").collection("addNewMobileInfo");
    console.log("database connected");

    // for order data
    const orderCollection = client.db("goMobile").collection("order");
    console.log("database connected");

    // for insert api
    app.post('/addNewMobileInfo', (req, res) => {
        const newMobileInfo = req.body;
        console.log('adding new mobile: ', newMobileInfo);
        newMobileCollection.insertOne(newMobileInfo)
            .then(result => {
                console.log("inserted count", result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

    // for order api
    app.post('/order', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                console.log("inserted count", result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

    // for specific data find api
    app.get('/product/:id', (req, res) => {
        newMobileCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    // for order show api
    app.get('/showOrder', (req, res) => {
        console.log(req.query.email);
        orderCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // for read all data from database
    app.get('/mobileInfo', (req, res) => {
        newMobileCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    // for delete api
    app.delete('/delete/:id',(req,res) => {
        newMobileCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })

});


app.listen(port || process.env.PORT);