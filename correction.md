# Liste de points developpé

* A1 : Les données sont stocké dans une base de données mongodb. La db "MTLdata" est crée avec la collection "installations".
    * Test: la fonction update() du module db.js charge les données et est appeller automatiquement quand l'application est mis en ligne.
        * Lancer l'application : npm start
        * Observer la console pour le message "Connection established."
        * Verfier l'état de la base de données sur votre console mongodb :
            * use MTLdata
            * db.installations.find()

* A2 : L'importation de données du point A1 est faite automatiquement chaque jour à minuit.
    * Test : Lancer l'application, attendre minuit, observer la console pour le message "Cron job started.". (pas très pratique)
    * Test pratique :
        * Dans le fichier db.js : rajouter '//' au debut de la ligne 99 et enlever '//' au debut de la ligne 98.
        * Lancer l'application (npm start); La mis à jour va maintenant etre lancer à chaque minute.

* A3 : La documentation des services REST offert est disponible a la route "/doc".
    * Test : Lancer l'application et une page web a l'adresse http://localhost:3000/doc

* A4 : Le système offre un service REST permettant d'obtenir la liste des installations en format json pour un arrondissement spécifié en paramètre.
    * Test : Lancer directement la requete avec une route et paramètres, par exemple : https://inf4375-labj.herokuapp.com/installations?arrondissement=LaSalle

* A5 : Une application JavaScript/HTML permet de saisir un arrondissement à partir d'un formulaire HTML. Lorsque l'utilisateur lance la recherche, une requête Ajax contenant l'arrondissement saisis est envoyée à la route définie en A4. Lorsque la réponse Ajax revient, l'application affiche la liste des installations dans un tableau.
    * Test : L'application est disponible sur la page d'accueil du serveur (route « / »). Utilisé l'interface pour faire vos tests.

* A6 : L'application du point A5 offre un mode de recherche par nom d'installation.
    * Test : L'application est disponible sur la page d'accueil du serveur (route « / »). Utilisé la liste déroulante pour faire vos tests.

* B1 : Le système détecte les nouvelles installations depuis la dernière importation de données, en dresse une liste sans doublon et l'envoi par courriel automatiquement.
    * Test pratique :
        * Pour simplifier les tests une adresse couriel bidon est disponible -> user: sender4375@gmail.com password : sendemail
        * De plus pour forcer l'envoi du courriel enlever les caractères "//" au début de la ligne 113 du fichier scripts.js
        * On note que de cette façon le courriel est envoyé deux au lieux d'une car la variable "post" est toujours remplis.

* B2 : Les noms des nouvelles installations sont publiés automatiquement sur un compte Twitter.
    * Test pratique :
        * Pour simplifier les tests un compte Twitter bidon est disponible "@Sender4375"
        * De plus pour forcer la publication enlever les caractères "//" au début de la ligne 113 du fichier scripts.js

* C1 : Le système offre un service REST permettant d'obtenir la liste des installations en mauvaise condition.
    * Route : /installations/movaise-condition/json
    * Test :  Lancer directement la requete, elle ne prend aucun paramètres, par exemple : https://inf4375-labj.herokuapp.com/installations/movaise-condition/json

* C2 : Le système offre un service REST permettant d'obtenir la liste des installations en mauvaise condition en format xml.
    * Route : /installations/movaise-condition/xml
    * Test :  Lancer directement la requete, elle ne prend aucun paramètres, par exemple : https://inf4375-labj.herokuapp.com/installations/movaise-condition/xml

* C3 : Le système offre un service REST permettant d'obtenir la liste des installations en mauvaise condition en format csv.
    * Route : /installations/movaise-condition/csv
    * Test :  Lancer directement la requete, elle ne prend aucun paramètres, par exemple : https://inf4375-labj.herokuapp.com/installations/movaise-condition/csv

* F1 : Le système est entièrement déployé sur la plateforme infonuagique Heroku.
    * Test : Le système est disponible sur Heroku à l'adresse : https://inf4375-labj.herokuapp.com
