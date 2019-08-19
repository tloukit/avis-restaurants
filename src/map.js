const loadGoogleMapsApi = require('load-google-maps-api')
import $ from 'jquery';
import * as restaurantjs from './restaurantEvents';
import * as restaurant from '../src/restaurant';
import * as templates from '../src/templates';
import imageMarkerGeo from '../src/assets/images/geo.png';
import { jsonFile } from './services';

export let listRestaurants = [], map;

/**
 *Utilistion d'un module webpack pour charger l'api google map
 * @export
 */
export function initGMap() {
    loadGoogleMapsApi({
        key: process.env.GOOGLEMAPS_KEY,
        libraries: ['places']
    }).then(googleMaps)
}

/**
 *Fonction qui permet de récupéré la position de l'utilisateur
 */
const googleMaps = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess,positionRefused);
    } else {
        $('#map').append(templates.errorHandler('La géolocalisation n\'est pas supportée par votre navigateur.<br>Veuillez changer de navigateur pour pouvoir utiliser ce service.'));
    }
}

/**
 *Lancement de la google map avec la liste de restaurants json et la librarie places
 * @param {*} position
 */
const positionSuccess = (position) => {
    map = new google.maps.Map(document.getElementById('map'), {
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
        map,
        icon: imageMarkerGeo
    });
    listRestaurantsFromJson();
    idleEvents();
    nearbySearchPlaces();
}
/**
 *Message d'erreur en cas de géolocalisation désactivée
 */
const positionRefused = () => {
    const
    defaultLat = 48.8534,
    defaultLng = 2.3488;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: defaultLat,
            lng: defaultLng
        },
        zoom: 10
    });
    new google.maps.Marker({
        position: {
            lat: defaultLat,
            lng: defaultLng
        },
        map,
        icon: imageMarkerGeo
    });
    listRestaurantsFromJson();
    idleEvents();
    nearbySearchPlaces();
}
/**
 *Création de l'affichage de chaque restaurant du fichier JSON
 */
const listRestaurantsFromJson = () => {
    jsonFile.forEach(element => {
        const resto = new restaurant.Restaurant(
            element.restaurantName,
            element.address,
            element.lat,
            element.long,
            element.ratings,
            null);
        addRestaurant(resto);
    });
}

/**
 *Ecouteurs d'évenements
 */
const idleEvents = () => {
    google.maps.event.addListener(map, 'zoom_changed', () => {
        restaurantjs.displayFilterRestaurant(listRestaurants,$( "#slider-range" ).slider( "values", 0 ),$( "#slider-range" ).slider( "values", 1 ));
     });
     google.maps.event.addListener(map, 'drag', () => {
        restaurantjs.displayFilterRestaurant(listRestaurants,$( "#slider-range" ).slider( "values", 0 ),$( "#slider-range" ).slider( "values", 1 ));
     });
    restaurantjs.addMarkerNewRestaurant();
    restaurantjs.checkFilterRates();
}

/**
 *Création de l'affichage de chaque restaurants contenu dans l'array listRestaurants
 * @param {*} resto
 */
const addRestaurant = (resto) => {
    listRestaurants.push(resto);
    resto.displayRestaurant();
    resto.marker.addListener('click', () => {
        resto.displayModal();
        resto.displayComments();
        resto.commentValidation();
    });
}
/**
 *Recherche de restaurants et de reviews correspondant à la requête
 */
const nearbySearchPlaces = () => {
    const request = {
        keyword: 'Restaurant',
        location: map.center,
        radius: 500,
        type:'restaurant'
    };
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                const placeDetailsRequest = {
                    fields: ['reviews'],
                    placeId: place.place_id
                };
                map.setCenter(place.geometry.location);
                let reviews = [];
                service.getDetails(placeDetailsRequest,(resultsDetails,status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resultsDetails.reviews.forEach(review => {
                            reviews.push({
                                stars:review.rating,
                                comment:review.text
                            });
                        });
                        const resto = new restaurant.Restaurant(
                            place.name,
                            place.vicinity,
                            place.geometry.location.lat(),
                            place.geometry.location.lng(),
                            reviews,
                            null);
                        addRestaurant(resto);
                    } else {
                        $('#map').append(templates.errorHandler('Error Place Service status: '+status));
                    }
                });
            })
        } else {
            $('#map').append(templates.errorHandler('Error Place Details Service status: '+status));
        }
    });
}
