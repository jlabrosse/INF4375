var http = require("http");
var xmldom = require("xmldom");
var csv = require("csvtojson");
var nRequest = require('request');
var format = require("./format");

function getRinksData(callback) {
	var options = {
    host: "www2.ville.montreal.qc.ca",
    path: "/services_citoyens/pdf_transfert/L29_PATINOIRE.xml",
		method: "GET"
	};
  var request = http.request(options, function (result) {
    if (result.statusCode !== 200) {
      callback("HTTP Error: " + result.statusCode);
    } else {
      var chunks = [];
      result.setEncoding("utf-8");

      result.on("data", function (chunk) {
        chunks.push(chunk);
      });

      result.on("end", function () {
        var completeHtmlData = chunks.join("");
        var domRoot = new xmldom.DOMParser().parseFromString(completeHtmlData.toString());
        var jsonData = format.createRinkList(domRoot);
        callback(null, jsonData);
      });
    }
  });

  // En cas d'erreur, on appelle un callback de gestion d'erreur.
  request.on("error", function (e) {
    callback(e);
  });

  // On envoie la requête http.
  request.end();
}

function getSlidesData(callback) {
	var options = {
    host: "www2.ville.montreal.qc.ca",
    path: "/services_citoyens/pdf_transfert/L29_GLISSADE.xml",
		method: "GET"
	};
  var request = http.request(options, function (result) {
    if (result.statusCode !== 200) {
      callback("HTTP Error: " + result.statusCode);
    } else {
      var chunks = [];
      result.setEncoding("utf-8");

      result.on("data", function (chunk) {
        chunks.push(chunk);
      });

      result.on("end", function () {
        var completeHtmlData = chunks.join("");
        var domRoot = new xmldom.DOMParser().parseFromString(completeHtmlData.toString());
        var jsonData = format.createSlideList(domRoot);
        callback(null, jsonData);
      });
    }
  });

  // En cas d'erreur, on appelle un callback de gestion d'erreur.
  request.on("error", function (e) {
    callback(e);
  });

  // On envoie la requête http.
  request.end();
}

var list = [];
function getPoolData(callback) {
  console.log("Generating pool list.");
  nRequest.get('http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          csv().fromString(body).on("json",function(row){
              list.push(row);
          }).on('done', function(){
            console.log("Generating pool list done.");
            var jsonList = format.normalizePoolData(list);
            callback(null, jsonList);
          });
      }else {
        callback(error, response.statusCode);
      }
  });
}

exports.getRinksData = getRinksData;
exports.getSlidesData = getSlidesData;
exports.getPoolData = getPoolData;
