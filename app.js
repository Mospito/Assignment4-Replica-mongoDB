
const http = require('http');
const cors = require('cors')
const hostname = '127.0.0.1';
const express = require('express')
const app = express()
const { json } = require('express')
const router = require('express').Router()
const PORT = 3000;

const mongoose = require("mongoose");
const Model = require('./model')


// const db = require('./db.js')

var MongoClient = require('mongodb').MongoClient;
const req = require('express/lib/request');
const res = require('express/lib/response');
var url = "mongodb://localhost:27018/";

mongoose.connect(url);

var myobj = { name: "Company Inc", address: "Highway 37" };


app.use(cors({
    origin: '*'
}));

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.route('/disease')
    .get(cors(),(req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("admin");
            // dbo.collection("customers").findOne({}, function (err, result) {
            //     if (err) throw err;
            //     console.log(result.name);
            //     res.json(result)
            //     db.close();
            // });
            dbo.collection("customers").find().toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.json(result)
                db.close();
            });
        });

    })
    .post(cors(),(req, res) => {
        try {
            const data = {
                id: req.body.id,
                name: req.body.name,
                position: req.body.position,
                salary: req.body.salary,
                address: req.body.address
            }

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("admin");
      
                dbo.collection("customers").insertOne(data, function (err, result) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    res.json(result)
                    db.close();
                });


            });
        }
        catch {
            res.json({ status: "Fail! T_T" })
        }
    })


app.use(cors({
        origin: '*'
    }));
router.route('/disease/:ID')
    .get(cors(),(req, res) => {

        let _id = req.params.ID
   
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("admin");

            dbo.collection("customers").findOne({ "id": _id }, function (err, result) {
                if (err) throw err;
                // console.log(result.name);
                res.json(result)
                db.close();
            });
        });
      

    })
    .put(cors(),(req, res) => {


        let _id = req.params.ID
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("admin");
            var myquery = { id: _id };
            var newvalues = { $set: {
                id: req.body.id,
                name: req.body.name,
                position: req.body.position, 
                salary: req.body.salary,
                address: req.body.address 

            } };
            dbo.collection("customers").updateOne(myquery, newvalues, function(err, result) {
              if (err) throw err;
              console.log("1 document updated");
              res.json(result)
              db.close();
            });
          });

    })
    .delete(cors(),(req, res) => {
        let _id = req.params.ID

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("admin");
            var myquery = { id: _id };
            dbo.collection("customers").deleteOne(myquery, function(err, obj) {
              if (err) throw err;
              console.log("1 document deleted");
              res.json(obj)
              db.close();
            });
          });
    })







app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))