# PROJET 7 - Site d'avis de restaurants
Réalisé dans le cadre de la formation développeur d'application front-end Openclassrooms

[LIEN DEMO](https://steventchakpe.com/openclassrooms/avis_restaurants/) 

![Image du site d'avis de restaurants](https://steventchakpe.com/openclassrooms/img/avis_restaurants.png)




## Etape 1 : la carte des restaurants
Commencez par les fondations de votre application. Il y aura 2 sections principales :

Une carte Google Maps, chargée avec l'API de Google Maps

Une liste de restaurants correspondant à la zone affichée sur la carte Google Maps

Vous placerez ces éléments côte à côte.

La carte Google Maps sera centrée immédiatement sur la position de l'utilisateur. Vous utiliserez l'API de géolocalisation de JavaScript. Un marqueur de couleur spécifique sera placé à l'emplacement de l'utilisateur.

Une liste de restaurants est fournie sous forme de données JSON présentées dans un fichier à part. En temps normal, ces données vous seraient renvoyés par un backend via une API, mais pour cet exercice il sera pour le moment suffisant de charger en mémoire tous les restaurants en mémoire directement.

Affichez ces restaurants grâce à leurs coordonnées GPS sur la carte. Les restaurants qui sont actuellement visibles sur la carte doivent être affichés sous forme de liste sur le côté de la carte. Vous afficherez la moyenne des commentaires de chaque restaurant (qui va de 1 à 5 étoiles).

Lorsqu'on clique sur un restaurant, la liste des avis enregistrés s'affiche avec les commentaires. Affichez aussi la photo Google Street View grâce à l'API correspondante.

Un outil de filtre permet d'afficher uniquement les restaurants ayant entre X et Y étoiles. La mise à jour de la carte s'effectue en temps réel.

## Etape 2 : ajoutez des restaurants et des avis !

A chaque tour, un joueur peut se déplacer d’une à trois cases (horizontalement ou verticalement) avant de terminer son tour. Vos visiteurs aimeraient eux aussi donner leur avis sur des restaurants !Proposez-leur :

D'ajouter un avis sur un restaurant existant

D'ajouter un restaurant, en cliquant sur un lieu spécifique de la carte

Une fois un avis ou un restaurant ajouté, il apparaît immédiatement sur la carte. Un nouveau marqueur apparaît pour indiquer la position du nouveau restaurant.

Les informations ne seront pas sauvegardées si on quitte la page (elles restent juste en mémoire le temps de la visite).

## Etape 3 : intégration avec l'API de Google Places

Pour l'instant, il n'y a pas beaucoup de restaurants et pas beaucoup d'avis. Heureusement, Google Places propose une API pour récupérer des restaurants et des avis. Servez-vous en pour afficher des restaurants et avis supplémentaires sur votre carte ! Ici la documentation : https://developers.google.com/places/

## Getting Started

### Prerequisites

NodeJS version 8 min

### Installing
Installer les modules du fichier package.json :

```
npm install
```
Lancer l'application en mode développeur via la commande :

```
npm start
```

Construire le build l'application via la commande :

```
npm run build
```


## Built With

* [GOOGLE MAP API - Maps Javascript](https://cloud.google.com/maps-platform/) - API
* [GOOGLE MAP API - Geocoding](https://cloud.google.com/maps-platform/) - API
* [GOOGLE MAP API - Street View Static](https://cloud.google.com/maps-platform/) - API
* [GOOGLE MAP API - Places](https://cloud.google.com/maps-platform/) - API

* [WEBPACK](https://webpack.js.org/) - Bundler
* [BABEL](https://babeljs.io/) - Compilateur javascript
* [JQUERY](https://jquery.com/) - Bibliothèque javascript
* [BOOTSTRAP](https://getbootstrap.com/) - Framework CSS


## Authors

* **Steven TCHAKPE** - *Dans le cadre de la formation développeur front-end Openclasrooms* - [Openclassrooms](https://openclassrooms.com/fr/)

