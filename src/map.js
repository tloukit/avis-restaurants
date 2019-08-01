const loadGoogleMapsApi = require('load-google-maps-api')
import $ from 'jquery';
import * as restaurantjs from '../src/restaurantEvents';
import * as restaurant from '../src/restaurant';
import * as templates from '../src/templates';
import imageMarkerGeo from '../src/assets/images/geo.png';
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
    }).then(googleMaps)
}

/**
 *
 *
 */
const googleMaps = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess,positionError);
    }
}

/**
 *
 *
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
 *
 *
 */
const positionError = () => {
    $('#map').append(templates.errorHandler('La géolocalisation de votre navigateur est desactivée.<br>Veuillez l\'activer pour pouvoir utiliser ce service.'));
}
/**
 *
 *
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
 *
 *
 */
const idleEvents = () => {
    google.maps.event.addListener(map, 'zoom_changed', () => {
        //restaurantjs.displayVisibleRestaurantsOnMap();
        restaurantjs.displayFilterRestaurant(listRestaurants,$( "#slider-range" ).slider( "values", 0 ),$( "#slider-range" ).slider( "values", 1 ));
     });
     google.maps.event.addListener(map, 'dragend', () => {
        //restaurantjs.displayVisibleRestaurantsOnMap();
        restaurantjs.displayFilterRestaurant(listRestaurants,$( "#slider-range" ).slider( "values", 0 ),$( "#slider-range" ).slider( "values", 1 ));
     });
    restaurantjs.addMarkerNewRestaurant();
    restaurantjs.checkFilterRates();
}
/**
 *
 *
 * @param {*} resto
 */
/**
 *
 *
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
 *
 *
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
                        $('#map').append(templates.errorHandler('Error status: '+status));
                    }
                });
            })
        } else {
            $('#map').append(templates.errorHandler('Error status: '+status));
        }
    });
}

$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 5,
      values: [ 0, 5 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "Mini : " + ui.values[ 0 ] + " Max : " + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "Mini : " + $( "#slider-range" ).slider( "values", 0 ) +
      " Max : " + $( "#slider-range" ).slider( "values", 1 ) );
  } );