var mongodb = require("mongodb");
var cronJob = require('node-cron');
var fetcher = require("../public/javascripts/fetcher.js");

var instanceMongoDB;
var rinkData = null;
var slideData = null;
var poolData = null;
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGODB_URI;


/*
  getConnection(callback) : fonction qui instancie la connection a la base de données local
    ou sur mLab si le local n'est pas disponible.
  Log une l'erreur si la connection est impossible.
*/
function getConnection(callback) {
  if (instanceMongoDB) {
    callback(null, instanceMongoDB);
  } else {

    MongoClient.connect(url || 'mongodb://localhost:27017/MTLdata', function (err, db) {
     if (err) {
       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
       console.log('Connection established.');

       instanceMongoDB = db;
       callback(err, instanceMongoDB);
     }
    });
  }
};

/*
  update() : fonction qui s'occupe de la mis à jour de la base de données et qui log
    le status avec une descriptions correspondant.
*/
function update(){
  var res = { "status" : "ok", "message" : ""};

  fetcher.getRinksData(function ( err, data ){
    rinkData = data;
    complete();
  });

  fetcher.getSlidesData(function (err, data ){
    slideData = data;
    complete();
  });

  fetcher.getPoolData(function (err, data ){
    poolData = data;
    complete();
  });

  function complete(){
    if( rinkData !== null && slideData !== null && poolData !== null){
      getConnection(function(err, db){
        db.collection('installations', function (err, collection) {
          if (err) {
            res.status = 500;
            res.message = res.message +  "-//- Error, collection is unreachable.";
          } else {
            collection.remove({});

            collection.insert(rinkData.rinkList, function(err, result) {
              if (err) {
                res.status = 500;
                res.message = res.message + "-//- Error on rink list insert.";
              }
            });

            collection.insert(slideData.slideList, function(err, result) {
              if (err) {
                res.status = 500;
                res.message = res.message + "-//- Error on slide list insert.";
              }
            });

            collection.insert(poolData, function(err, result) {
              if (err) {
                res.status = 500;
                res.message = res.message + "-//- Error on pool list insert.";
              }
            });
          }
        });
      });
    }
    console.log(res);
    console.log("Updated.");
  }

}

//cronJob.schedule('*/1 * * * *', function() {
cronJob.schedule('0 0 0 * * *', function() {
  //Tache executer a chaque jours a minuit.
  console.log("Cron job started.");
  update();
});

exports.getConnection = getConnection;
exports.update = update;
