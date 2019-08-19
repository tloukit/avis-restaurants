import $ from 'jquery'
import { map } from './map'
import { listRestaurants } from './map';
import * as templates from './templates';
import * as restaurant from './restaurant';


/**
 * Variables globales pour la gestion des marker
 */
let globalTempMarker = null;
let globalTempAddress = null;
/**
 * Variable global récupérant la note
 */
export let globalCommentRate = null;

/**
 * Ajout un marker sur la carte et ouvre une modal pour ajout de restaurant
 * @export
 */
export function addMarkerNewRestaurant (){
    const mark = map.addListener('click', (e) => {
        placeMarkerAndPanTo(e.latLng, map);
        google.maps.event.removeListener(mark);
        displayModalRestaurant(e.latLng);
    },{once : true});

    const placeMarkerAndPanTo = (latLng, map) => {
        const marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        marker.setVisible(false);
        globalTempMarker = marker;
        let geocoder = new google.maps.Geocoder();
        geocodeLatLng(geocoder,marker.map,marker.position);
        map.panTo(latLng);
    }
}

/**
 *Affichage de la modal d'ajout de restaurant
 */
function displayModalRestaurant (position) {
    $('#modal-element').modal();
    $('.modal-body,.modal-title,#add-comment').empty();
    $('.modal-title').append(templates.headerAddRestaurant(position));
    $('.modal-body').append(templates.formAddRestaurant);
    eventCloseModalRestaurant();
}

/**
 *Permet de récupére l'adresse du lieu qui a été cliqué sur la map
 * @param {*} geocoder Instance de geocoder
 * @param {*} map Instance de map
 * @param {*} position Position lat lng
 */
function geocodeLatLng(geocoder,map,position) {
    //On récupére les valeur lat et long contenues dans position
    const latlng = position;
    //On utilise la méthode geocoder de l'api google map pour récupérer l'adresse postale correspondant aux coordoonées lat long
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(11);
                let address = results[0].formatted_address;
                globalTempAddress = address;
                let splittedAdd = address.split(',');
                addAdressToInput(splittedAdd,latlng);
            } else {
                $('#map').append(templates.errorHandler('Geocode : Pas de résultat'));
            }
        } else {
            $('#map').append(templates.errorHandler('Erreur Geocoder : '+status));
        }
    });
}

/**
 *L'adresse récupérée via geocoder et affichée dans les placeholder
 * @param {*} splittedAdd
 * @param {*} latLng
 */
function addAdressToInput (splittedAdd,latLng){
    let postalcodeAndCity = splittedAdd[1].split(' ');
    let [,postalcode, ...city] = postalcodeAndCity;
    city = city.join(' ');
    $("#form-address-restaurant").attr("placeholder", splittedAdd[0]);
    $("#form-city-restaurant").attr("placeholder", city);
    $("#form-postalcode-restaurant").attr("placeholder", postalcode);
    restaurantValidation(latLng);
}

/**
 *Controle le formulaire de validation d'ajout de restaurant
 * @param {*} latLng
 */
function restaurantValidation(latLng){
    $('#submit-restaurant').off('click').on('click',function() {
        const restaurantName = $('#form-name-restaurant').val();
        const regexAlphaNumChar = /^[a-zA-Z0-9]*$/;
        $('.invalid-message').removeClass('visibility-hide');
        if (restaurantName.length > 2 && restaurantName.match(regexAlphaNumChar)){
            const latlngJson = latLng.toJSON();
            listRestaurants.push(new restaurant.Restaurant(restaurantName,globalTempAddress,latlngJson.lat,latlngJson.lng,[],globalTempMarker));
            const restaurantObject = listRestaurants.slice(-1).pop();
            listRestaurants.slice(-1).pop().displayRestaurant();
            restaurantObject.marker.addListener('click', () => {
                restaurantObject.displayModal();
                restaurantObject.displayComments();
                restaurantObject.commentValidation();
            });
            $('#modal-element').modal('hide');
            addMarkerNewRestaurant();

        } else {
            $('.invalid-message').html('<p>Veuillez remplir le champ uniquement avec au moins 3 chiffres et/ou des lettres</p>')
            $('.invalid-message').addClass('visibility-show');
        }
    })
}

/**
 *Créer l'évenement qui permet d'ajouter un restaurant à la fermeture de la modal d'ajout de restaurant
 * @export
 */
export function eventCloseModalRestaurant(){
    $('#modal-element').on('hidden.bs.modal', () => {
        addMarkerNewRestaurant();
    })
}

/**
 *Controle la validité du filtre de selection des notes
 * @export
 */
export function checkFilterRates(){
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 5,
        values: [ 0, 5 ],
        slide: ( event, ui ) => {
        $( "#rates" ).val( "Mini : " + ui.values[ 0 ] + " Max : " + ui.values[ 1 ] );
        },
        change: ( event, ui ) => {
            displayFilterRestaurant(listRestaurants,ui.values[ 0 ],ui.values[ 1 ]);
        }
    });
    $( "#rates" ).val( "Mini : " + $( "#slider-range" ).slider( "values", 0 ) +
        " Max : " + $( "#slider-range" ).slider( "values", 1 ) );
}

/**
 *Affiche les restaurants en fonction de la fourchette de notes demandée par l'utilisateur
 * @export
 * @param {*} listRestaurants
 * @param {*} min
 * @param {*} max
 */
export function displayFilterRestaurant(listRestaurants,min,max){
    const bds = map.getBounds();
    const southLat = bds.getSouthWest().lat();
    const southLng = bds.getSouthWest().lng();
    const northLat = bds.getNorthEast().lat();
    const northLng = bds.getNorthEast().lng();
    listRestaurants.forEach(restaurant => {
        if(restaurant.calcAverageRateRestaurant >= min && restaurant.calcAverageRateRestaurant <= max && restaurant.lat > southLat && restaurant.lat < northLat && restaurant.long > southLng && restaurant.long < northLng){
            $('.'+restaurant.parsedRestaurantName).attr("style", "display: flex !important");
            restaurant.marker.setMap(map);
        } else {
            $('.'+restaurant.parsedRestaurantName).attr("style", "display: none !important");
            restaurant.marker.setMap(null);
        }
    });
}

/**
 *Gestion de l'ajout des étoiles
 * @export
 */
export function ratingStars(){
    globalCommentRate = null;
    const starsClass = ['s5','s4','s3','s2','s1'];
    let rate;
    for (let i = 0 ; i < starsClass.length; i++){
        $('.'+starsClass[i]).click(() => {
            $('.stars>i.stars-full').removeClass('stars-full');
            for (let j = 0; j <= i ; j++){
                $('.'+starsClass[j]).addClass('stars-full');
                rate = i+1;
            }
            globalCommentRate = rate;
        });
    }
}