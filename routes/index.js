var express = require('express');
var mongodb = require('mongodb');
var raml2html = require('raml2html');
var json2csv = require('json2csv');
var xml = require('xml');
var router = express.Router();
var db = require('./db');
var format = require("../public/javascripts/format.js");

db.update();

router.get('/', function(req, res, next) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.distinct('nom').then(function (installations) {
          if(installations){
            res.render('index', {items:installations.sort()});
          }else{
            res.render('index', {items:["N/A"]});
          }
        });
      }
    });
  });
});

router.get('/doc', function(req, res) {
  var config = raml2html.getDefaultConfig(false);
  var onError = function (err) {
    console.log(err);
    res.sendStatus(500);
  };
  var onSuccess = function(html) {
    res.send(html);
  };
  raml2html.render("routes/doc/index.raml", config).then(onSuccess, onError);
});

router.get('/installations', function (req, res) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log("query:");
        console.log(req.query);
        collection.find({nom_arr: req.query.arrondissement}, {'_id': false}).toArray(function (err, installations) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.json(installations);
          }
        });
      }
    });
  });
});

router.get('/installations/simple', function (req, res) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log("query:");
        console.log(req.query);
        collection.find({nom: req.query.nom}, {'_id': false}).toArray(function (err, installation) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.json(installation);
          }
        });
      }
    });
  });
});

router.get('/installations/movaise-condition/json', function (req, res) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.find({condition : "Mauvaise"}, {'_id': false}).toArray(function (err, installations) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if(installations.length){
            res.json(installations.sort(format.compareName));
          } else {
            res.json([]);
          }
        });
      }
    });
  });
});

router.get('/installations/movaise-condition/xml', function (req, res) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.find({condition : "Mauvaise"}, {'_id': false}).toArray(function (err, installations) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if(installations.length){
            var sortedItems = installations.sort(format.compareName);
            var jsonPreparedList = {"installations" : []};
            for (var i = 0; i < sortedItems.length; i++){
              var item = {"installation" : []};
              var temp = sortedItems[i];
              for(var key in temp){
                var obj = {};
                obj[key] = temp[key];
                item.installation.push(obj);
              }
              jsonPreparedList.installations.push(item);
            }

            res.set('Content-Type', 'text/xml');
            res.send(xml(jsonPreparedList, { declaration: { standalone: 'yes', encoding: 'UTF-8' }}));
          } else {
            res.send("");
          }
        });
      }
    });
  });
});

router.get('/installations/movaise-condition/csv', function (req, res) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.find({condition : "Mauvaise"}, {'_id': false}).toArray(function (err, installations) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if(installations.length){
            var data = json2csv({data : installations});
            res.attachment('movaise-condition.csv');
            res.status(200).send(data);
          } else {
            res.send("");
          }
        });
      }
    });
  });
});

module.exports = router;
