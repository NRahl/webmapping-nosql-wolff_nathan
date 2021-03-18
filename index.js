// le app.use : c'est pour les middleware uniquement. ça ne bloque rien. On met d'abord les use puis les get, post ou autre all.
//app.use ça se superpose les uns sur les autres, pas le app.get et autres...

/*const jsdom = require("jsdom");
const { JSDOM } = jsdom;*/

var mydb;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/geo", function(err, db) {
 console.log("Connected correctly to server");

 mydb = db;
 app.listen(3000);
 console.log("Server listening...");
});

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

app.get('/geo-search', function(req, res){
   res.render('form');
});

app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));
app.use('/static', express.static('public'));

app.get('/geo-search-results', function(req, res){
  console.log(req.query);
 
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var radius = parseFloat(req.query.radius);
 
  var filter = {};
  if (Math.abs(longitude) > 0.00001 &&
      Math.abs(latitude) > 0.00001 &&
      Math.abs(radius) > 0.00001) {
 
    filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius ] } };
  }
  // console.log("filter", filter, [ longitude, latitude ]);
 
  mydb.collection('equip').find(filter).toArray(function(err, docs) {
    console.log("Found "+docs.length+" records");
    //console.dir(docs);
    res.render('geo-search-results', {
      results: docs
    });
  });
  //res.send("recieved your request!");

 });

// ---------------------------------------- \\

app.get('/geo-search-results-json', function(req, res){
  console.log(req.query);
 
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var radius = parseFloat(req.query.radius);
 
  var filter = {};
  if (Math.abs(longitude) > 0.00001 &&
      Math.abs(latitude) > 0.00001 &&
      Math.abs(radius) > 0.00001) {
 
    filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius ] } };
  }
  //console.log("filter", filter);
 
  mydb.collection('equip').find(filter).toArray(function(err, docs) {
    console.log("Found "+docs.length+" records");
    //console.dir(docs);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(
     {
       "type": "FeatureCollection",
       "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
       "features": docs
     }
    ));
  });
 });