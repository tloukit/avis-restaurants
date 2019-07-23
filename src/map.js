const loadGoogleMapsApi = require('load-google-maps-api')
import $ from 'jquery'
import * as restaurantjs from '../src/restaurantEvents';
import * as restaurant from '../src/restaurant';
import imageMarkerGeo from '../src/assets/images/geo.png'
import { jsonFile } from './services';

export let listRestaurants = [], map;
//On utilise un module webpack pour charger l'api google map
/**
 *
 *
 * @export
 */
export function initGMap() {
    loadGoogleMapsApi({
        key: process.env.GOOGLEMAPS_KEY,
        libraries: ['places']
    }).then(function (googleMaps) {
        /**
        * Création d'une map avec un zoom sur la position de l'utilisateur
        * Gestion des erreurs de localisation
        **/

        if (navigator.geolocation) {
            /**
            * Récupération de la position de l'utilisateur
            **/
            navigator.geolocation.getCurrentPosition(function (position) {
                map = new googleMaps.Map(document.getElementById('map'), {
                    center: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    zoom: 10
                });
                new google.maps.Marker({
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    map: map,
                    icon: imageMarkerGeo
                });
                /**
                 * On ajoute chaque restaurant récupéré via le json dans un tableau listRestaurants
                 **/
                for (let value of jsonFile){
                    listRestaurants.push(new restaurant.Restaurant(value.restaurantName,value.address,value.lat,value.long,value.ratings,null));
                }
                /**
                 * Idle events
                 **/
                google.maps.event.addListener(map, 'zoom_changed', function() {
                    restaurantjs.displayVisibleRestaurantsOnMap();
                 });
                 google.maps.event.addListener(map, 'dragend', function() {
                     restaurantjs.displayVisibleRestaurantsOnMap();
                 });
                restaurantjs.addMarker();
                restaurantjs.isValidSelectRate();

                 /**
                 * Lancement de la recherche de restaurants et commentaires correspondants via l'api places
                 **/
                const request = {
                    keyword: 'Restaurant',
                    location: map.center,
                    radius: 500,
                    type:'restaurant'
                };
                const service = new google.maps.places.PlacesService(map);
                  service.nearbySearch(request, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < results.length; i++) {
                            const placeDetailsRequest = {
                                fields: ['reviews'],
                                placeId: results[i].place_id
                            };
                            map.setCenter(results[i].geometry.location);
                            let reviews = [];
                            service.getDetails(placeDetailsRequest,(resultsDetails,status)=>{
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    resultsDetails.reviews.forEach(review => {
                                        const rating = {
                                            stars:review.rating,
                                            comment:review.text
                                        }
                                        reviews.push(rating);
                                    });
                                }
                            })
                            console.log(reviews);
                            listRestaurants.push(new restaurant.Restaurant(results[i].name,results[i].vicinity,results[i].geometry.location.lat(),results[i].geometry.location.lng(),reviews,null));
                        }
                         /**
                         * Affichage de chaque restaurant du tableau listRestaurants
                         **/
                        setTimeout(() => {
                            listRestaurants.forEach(function(restaurant) {
                                restaurant.displayRestaurant();
                                restaurant.marker.addListener('click', () => {
                                    restaurant.displayModal();
                                    restaurant.displayComments();
                                    restaurant.commentValidation();
                                });
                            });
                        }, 2000);
                    }
                });
            },
            function(error){
                console.log('Géolocalisation refusée :  Veuillez activer la geoloc')
            })
        }
    })
}