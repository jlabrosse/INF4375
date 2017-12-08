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
