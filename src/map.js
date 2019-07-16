const loadGoogleMapsApi = require('load-google-maps-api')
import $ from 'jquery'
import imageMarkerGeo from '../src/assets/images/geo.png'
import { jsonFile } from './services';
import * as restaurant from '../src/restaurant';


export let listRestaurants = [], map, infoWindow;
//On utilise un module webpack pour charger l'api google map
/**
 *
 *
 * @export
 */
export function initGMap() {
    loadGoogleMapsApi({
        key: process.env.GOOGLEMAPS_KEY
    }).then(function (googleMaps) {
        //Création d'une map avec un zoom sur la position de l'utilisateur
        map = new googleMaps.Map(document.getElementById('map'), {
            //Le centre de Paris est la localisation par défaut si l'utilisateur n'autorise pas le tracking GPS
            center: {
                lat: 48.8534,
                lng: 2.3488
            },
            zoom: 10
        });
        // On instancie la méthode InfoWindow
        infoWindow = new google.maps.InfoWindow;

        //Gestion des erreurs de localisation
        if (navigator.geolocation) {
            //Récupération de la position de l'utilisateur
            navigator.geolocation.getCurrentPosition(function (position) {
                //Ajout du marqueur de la position récupérée
                new google.maps.Marker({
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    map: map,
                    icon: imageMarkerGeo
                });
                //On ajoute chaque restaurant récupéré via le json dans un tableau listRestaurants
                for (let value of jsonFile){
                    //listRestaurants.push(value);
                    listRestaurants.push(new restaurant.Restaurant(value.restaurantName,value.address,value.lat,value.long,value.ratings,null));
                }
                listRestaurants.forEach(function(restaurant) {
                    restaurant.displayRestaurant();
                });
                restaurant.addMarker();
                restaurant.isValidSelectRate();
            },
            function(error){
                console.log('Géolocalisation refusée :  Position par défault')
                 //Ajout du marqueur de la position récupérée
                 new google.maps.Marker({
                    position: {
                        lat: 48.8534,
                        lng: 2.3488
                    },
                    map: map,
                    icon: imageMarkerGeo
                });
                //On ajoute chaque restaurant récupéré via le json dans un tableau listRestaurants
                for (let value of jsonFile){
                    //listRestaurants.push(value);
                    listRestaurants.push(new restaurant.Restaurant(value.restaurantName,value.address,value.lat,value.long,value.ratings,null));
                }
                listRestaurants.forEach(function(restaurant) {
                    restaurant.displayRestaurant();
                });
                restaurant.addMarker();
            })
        }
    })
}