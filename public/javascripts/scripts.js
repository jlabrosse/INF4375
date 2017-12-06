function createTable(result){
  console.log(result);
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

function getSingleInstallation() {
  var selectMenu = document.getElementById("nameSelect");
  var selectedItem = selectMenu.options[selectMenu.selectedIndex].text;
  $.ajax({url : "/installations/simple",
    data: "nom=" + selectedItem,
    dataType: "json",
  }).done(function(data){createTable(data)});
}

//mongod --port 27017 --dbpath C:\Users\Julien\Desktop\U\UQAM\S-8\INF4375\projet\projet_LABJ24049500\data
