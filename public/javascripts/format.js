var xmldom = require("xmldom");

/*
  createRinkList(xml) : Fonction qui prend en paramètre le document xml de la ville de montreal
    et qui le converti en structure json pour pouvoir l'inserer dans la base de données.
  On note que le champs "nom" est traiter de facon à supprimé les espaces en double qui polluent et complique
  la recherche par nom.
*/
function createRinkList(xml){
  var rinksList = xml.getElementsByTagName("patinoire");
  var jsonRinkList = {"rinkList" : []};
  if (!rinksList.length) {
    console.log("Ice rink xml sheet is empty.");
  } else {
    console.log("Generating rink list.");
    for (var i = 0; i < rinksList.length; i++) {
      var rink = rinksList[i];
      var name = rink.getElementsByTagName("nom")[0].textContent;
      var region = rink.getElementsByTagName("arrondissement")[0];
      var regionName = region.getElementsByTagName("nom_arr")[0].textContent;
      var key = region.getElementsByTagName("cle")[0].textContent;
      var updateDate = region.getElementsByTagName("date_maj")[0].textContent;
      var open = rink.getElementsByTagName("ouvert")[0].textContent;
      var cleared = rink.getElementsByTagName("deblaye")[0].textContent;
      var watered = rink.getElementsByTagName("arrose")[0].textContent;
      var resurfaced = rink.getElementsByTagName("resurface")[0].textContent;
      var condition = rink.getElementsByTagName("condition")[0].textContent;
      var jsonRink = {
        "type" : "patinoire",
        "nom" : name.replace(/\s+/g, " "),
        "nom_arr" : regionName,
        "cle" : key,
        "date_maj" : updateDate,
        "ouvert" : open,
        "deblaye" : cleared,
        "arrose" : watered,
        "resurfaced" : resurfaced,
        "condition" : condition
      }
      jsonRinkList.rinkList.push(jsonRink);
    }
  }
  console.log("Generating rink list done.");
  return jsonRinkList;
}

/*
  createSlideList(xml) : Fonction qui prend en paramètre le document xml de la ville de montreal
    et qui le converti en structure json pour pouvoir l'inserer dans la base de données.
  On note que le champs "nom" est traiter de facon à supprimé les espaces en double qui polluent et complique
  la recherche par nom.
*/
function createSlideList(xml){
  var slidesList = xml.getElementsByTagName("glissade");
  var jsonSlideList = {"slideList" : []};
  if (!slidesList.length) {
    console.log("Slide xml sheet is empty.");
  } else {
    console.log("Generating slide list.");
    for (var i = 0; i < slidesList.length; i++) {
      var slide = slidesList[i];
      var name = slide.getElementsByTagName("nom")[0].textContent;
      var region = slide.getElementsByTagName("arrondissement")[0];
      var regionName = region.getElementsByTagName("nom_arr")[0].textContent;
      var key = region.getElementsByTagName("cle")[0].textContent;
      var updateDate = region.getElementsByTagName("date_maj")[0].textContent;
      var open = slide.getElementsByTagName("ouvert")[0].textContent;
      var cleared = slide.getElementsByTagName("deblaye")[0].textContent;
      var condition = slide.getElementsByTagName("condition")[0].textContent;
      var jsonSlide = {
        "type" : "glissade",
        "nom" : name.replace(/\s+/g, " "),
        "nom_arr" : regionName,
        "cle" : key,
        "date_maj" : updateDate,
        "ouvert" : open,
        "deblaye" : cleared,
        "condition" : condition
      }
      jsonSlideList.slideList.push(jsonSlide);
    }
  }
  console.log("Generating slide list done.");
  return jsonSlideList;
}

/*
  normalizePoolData(poolList) : Fonction qui prend en paramètres une liste d'objet json traduit d'un document
    csv grace au module csvtojson et converti le nom des clés des champs pour correspondre au autres structure dans
    la base de données et faciliter la recherche.
  On note que le champs "nom" est traiter de facon à supprimé les espaces en double qui polluent et complique
  la recherche par nom.
*/
function normalizePoolData(poolList){
  var jsonList = [];
  if(!poolList.length){
    return null;
  } else {
    for(var i = 0; i < poolList.length; i++){
      var pool = poolList[i];
      var type = pool.TYPE;
      type = type.toLowerCase();
      var jsonPool = {
        "id_uev" : pool.ID_UEV,
        "type" : type,
        "nom" : pool.NOM.replace(/\s+/g, " "),
        "nom_arr" : pool.ARRONDISSE,
        "adresse" : pool.ADRESSE,
        "propriete" : pool.PROPRIETE,
        "gestion" : pool.GESTION,
        "x" : pool.POINT_X,
        "y" : pool.POINT_Y,
        "equipement" : pool.EQUIPEME,
        "long" : pool.LONG,
        "lat" : pool.LAT
      };
      jsonList.push(jsonPool);
    }
  }
  console.log("pool data normalized.");
  return jsonList;
}

/*
  compareName(a, b) : Fonction à passé en paramètre à Array.sort() pour permettre de trié un liste d'objet
    json en fonction de leurs champs "nom".
*/
function compareName(a, b){
  if( a.nom > b.nom){
    return 1;
  }else if( a.nom < b.nom ){
    return -1;
  }
  return 0;
}

exports.createRinkList = createRinkList;
exports.createSlideList = createSlideList;
exports.normalizePoolData = normalizePoolData;
exports.compareName = compareName;
