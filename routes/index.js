var express = require('express');
var mongodb = require('mongodb');
var raml2html = require('raml2html');
var router = express.Router();
var db = require('./db');

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
        collection.find({nom_arr: req.query.arrondissement}).toArray(function (err, installations) {
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
        collection.find({nom: req.query.nom}).toArray(function (err, installation) {
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


router.get('/test', function(req, res, next) {
  db.getConnection(function(err, db){
    db.collection('installations', function (err, collection){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        collection.distinct('nom').then(function (installations) {
          res.render('index', {items:installations.sort()});
        });
      }
    });
  });
});


module.exports = router;
