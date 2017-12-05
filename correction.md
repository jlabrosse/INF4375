# Liste de points developpé

* A1 : Les données sont stocké dans une base de données mongodb. La db "MTLdata" est crée avec la collection "installations".
    * Test: la fonction update() du module db.js charge les données et est appeller automatiquement quand l'application est mis en ligne.
        * Lancer l'application : npm start
        * Observer la console pour le message "Updated."
        * Verfier l'état de la base de données sur votre console mongodb :
            * use MTLdata
            * db.installations.find()

* A2 : L'importation de données du point A1 est faite automatiquement chaque jour à minuit.
    * Test : Lancer l'application, attendre minuit, observer la console pour le message "Cron job started.". (pas très pratique)
    * Test pratique :
        * Dans le fichier db.js : rajouter '//' au debut de la ligne 88 et enlever '//' au debut de la ligne 87.
        * Lancer l'application (npm start); La mis à jour va maintenant etre lancer à chaque minute.

* A3 : La documentation des services REST offert est disponible a la route "/doc".
    * Test : Lancer l'application et une page web a l'adresse http://localhost:3000/doc

* A4 : 
