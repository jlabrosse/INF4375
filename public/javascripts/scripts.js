/*
  createTable(result) : Prend en entrée une liste d'objet json tiré de la base de données
    et insert une chaine de caractères qui correspond au code HTML d'un tableau qui contien
    l'information disponible sur chaque objet de la liste.
  Si la liste est vide la table est vidé et un message la remplace pour indiquer a l'utilisateur
  que il n'y a aucun résultat disponible.
*/
function createTable(result){
  if(result.length){
    var html = "";
    var header = "<tr> <th>Nom</th> <th>Type</th> <th>Nom arrondissement</th> <th>Information supplemetaire</th> </tr>";
    result.forEach(function(item) {
      html = html + installationObjectToRow(item);
    });
    document.getElementById("emptyResultMsg").innerHTML = "";
    document.getElementById("resultTable").innerHTML = header + html;
  }else{
    document.getElementById("resultTable").innerHTML = "";
    document.getElementById("emptyResultMsg").innerHTML = "Aucun résultat.";
  }
}

/*
  installationObjectToRow(jsonObject) : Une fonction utilisé par createTable pour traduire un objet
    json en chaine de caractères qui correspond a une ligne d'une table HTML.
*/
function installationObjectToRow(jsonObject) {
  var name = "<td class='left'>" + jsonObject.nom + "</td>";
  var type = "<td>" + jsonObject.type + "</td>";
  var reigon = "<td>" + jsonObject.nom_arr + "</td>";
  var extra = "<td class='left'>";
  for(var key in jsonObject){
    if(key !== "nom" && key !== "type" && key !== "nom_arr" && key !== "_id"){
      extra = extra + key + " : " + jsonObject[key] + "</br>";
    }
  }
  extra = extra + "</td>";
  var row = "<tr>" + name + type + reigon + extra + "</tr>";
  return row;
}

/*
  getSingleInstallation() : Une fonction AJAX qui permet sans paramètre de crée une table
    (createTable) en fonction de la valeur du champ nameSelect du formulaire HTML.
*/
function getSingleInstallation() {
  var selectMenu = document.getElementById("nameSelect");
  var selectedItem = selectMenu.options[selectMenu.selectedIndex].text;
  $.ajax({url : "/installations/simple",
    data: "nom=" + selectedItem,
    dataType: "json",
  }).done(function(data){createTable(data)});
}

/*
  sendUpdateEmail(nameList, destinataire) : Fonction qui envoi un courriel à un ou plusieurs destinataire(s)
    passé en paramètre.
  body : correspond au text dans le corps du message envoyer.
*/
function sendUpdateEmail(body, destinataire){
  var nodemailer = require("nodemailer");
  var smtpTransport = nodemailer.createTransport("smtps://sender4375%40gmail.com:"+encodeURIComponent('sendemail') + "@smtp.gmail.com:465");

  var mailOptions = {
      from: "<sender4375@gmail.com>",
      to: "sender4375@gmail.com",
      subject: "Liste des nouvelles installations ",
      text: body
  }

  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent.");
      }
      smtpTransport.close();
  });
}

/*
  postTweetUpdate(text) : Fonction qui publie un tweet sur un compte bidon cree pour le projet et disponible au correcteurs.
*/
function postTweetUpdate(text){
  var Twitter = require('twitter');
  //ici l'information n'est pas cacher ni dans un autre fichier car on utilise un compte bidon et temporaire.
  var client = new Twitter({
    consumer_key: 'bEEJ8KaejpdXlikypfQT6k683',
    consumer_secret: 'CQuO2JdqP2XAe2oaWs1Bj3JPevgigKY05WuYXT218SkFkEwUhu',
    access_token_key: '939224665989550080-2vc5TUKep5goJdMRRSMKezJuvQnbT54',
    access_token_secret: '5vmmN3wQpY35yWZNoP6d8gaIglDEdT04dpGw293lhAeXe'
  });
  var tweetText = "Nom des nouvelles installations : " + text;
  client.post('statuses/update', {status: tweetText}, function(error, tweet, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("tweet posted.");
    }
  });
}


/*
  manageDbUpdate(pre, post) : Fonction qui prend en charge les actions a executer suite a la mis a jour
    de la base de données.
  actions : - envoi un courriel avec la fonction sendUpdateEmail(<nom des nouvelles installations>, <liste des destinataires dans le fichier de configuration>)
            - publie un tweet avec la fonction postTweetUpdate(<nom des nouvelles installations>)
  paramètres : - pre : la liste des noms d'installations avant la mis à jours
               - post : la liste des noms d'installations apres la mis à jours
*/
function manageDbUpdate(pre, post){
  //post = ["un","test"];
  var yaml = require('js-yaml');
  fs = require('fs');
  let config = {};
  try {
    config = yaml.safeLoad(fs.readFileSync('./public/config/email.yml', 'utf8'));
    if(pre.length && post.length){
      //la variable diff est la difference entre les deux liste post et pre.
      var diff = post.filter(function(x) { return pre.indexOf(x) < 0 });
      if(diff.length){
        console.log("New data detected.");
        if(config.destinataire.length){
          sendUpdateEmail(diff.toString(), config.destinataire.toString());
        }else{
          console.log("Config file has no email addresses.")
        }
        postTweetUpdate(diff.toString());
      } else {
        console.log("No new data.");
      }
    }
  } catch (e) {
    console.log(e);
  }
}

exports.manageDbUpdate = manageDbUpdate;
