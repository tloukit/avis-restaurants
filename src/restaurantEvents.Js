import $ from 'jquery'
import { map } from './map'
import { listRestaurants } from './map';
import * as templates from '../src/templates';
import * as restaurant from '../src/restaurant';


/**
 * Variables globales pour la gestion des marker
 */
let globalTempMarker = null;
let globalTempAddress = null;

/**
 * Ajout un marker sur la carte et ouvre une modal pour ajout de restaurant
 * @export
 */
export function addMarker (){
    $('#add-restaurant').off('click').on('click',function() {
        const mark = map.addListener('click', (e) => {
            placeMarkerAndPanTo(e.latLng, map);
            google.maps.event.removeListener(mark);
            displayModalRestaurant();
        },{once : true});

        function placeMarkerAndPanTo(latLng, map) {
            const marker = new google.maps.Marker({
                position: latLng,
                map: map
            });
            globalTempMarker = marker;
            let geocoder = new google.maps.Geocoder();
            geocodeLatLng(geocoder,marker.map,marker.position);
            map.panTo(latLng);
        }
    })
}

/**
 *Affichage de la modal d'ajout de restaurant
 */
function displayModalRestaurant () {
    $('#modal-element').modal();
    $('.modal-body,.modal-title,#add-comment').empty();
    $('.modal-title').append(templates.headerAddRestaurant);
    $('.modal-body').append(templates.formAddRestaurant);
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
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
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
    console.log(postalcodeAndCity);
    let [emptyIndex,postalcode, ...city] = postalcodeAndCity;
    city = city.join(' ');
    console.log('postalcode',postalcode);
    console.log('city',city);

    $("#form-address-restaurant").attr("placeholder", splittedAdd[0]);
    $("#form-city-restaurant").attr("placeholder", city);
    $("#form-postalcode-restaurant").attr("placeholder", postalcode);
    console.log(splittedAdd);
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
        if (restaurantName.length > 2 && restaurantName.match(regexAlphaNumChar)){
            const latlngJson = latLng.toJSON();
            listRestaurants.push(new restaurant.Restaurant(restaurantName,globalTempAddress,latlngJson.lat,latlngJson.lng,[],globalTempMarker));
           // setTimeout(() => {
            //    console.log(globalTempMarker.setMap(null));
            //}, 3000);
            const restaurantObject = listRestaurants.slice(-1).pop();
            listRestaurants.slice(-1).pop().displayRestaurant();
            restaurantObject.marker.addListener('click', () => {
                restaurantObject.displayModal();
                restaurantObject.displayComments();
                restaurantObject.commentValidation();
            });
            $('#modal-element').modal('hide');

        } else {
            console.log('Entrées non valides');
        }
    })
}

/**
 *Controle la validité du filtre de selection des notes
 * @export
 */
export function isValidSelectRate(){
    $('#input-select-min,#input-select-max').change(function(){
        const minValue = $('#input-select-min').val();
        const maxValue = $('#input-select-max').val();
        const regexInteger = /^\d+$/;
        //Controle si la valeur récupérée est bien un nombre entier
        if(minValue.match(regexInteger) && maxValue.match(regexInteger)){
            if(maxValue >= minValue){
                $('.invalid-message').empty();
                //Execute la fonction qui permet de filter les restaurants si maxValue est sup ou égale à min value
                displayFilterRestaurant(listRestaurants,parseInt(minValue),parseInt(maxValue));
            } else {
                $('.invalid-message')
                //Affichage d'un message d'erreur si min est supérieure à max
                    .empty()
                    .append('<p>Veuillez saisir une note minimale inférieur ou égale à la note max</p>')
                    .css('visibility','visible');
            }
        }
    })
}

/**
 *Affiche les restaurants en fonction de la fourchette de notes demandée par l'utilisateur
 * @export
 * @param {*} listRestaurants
 * @param {*} min
 * @param {*} max
 */
export function displayFilterRestaurant(listRestaurants,min,max){
    listRestaurants.forEach(restaurant => {
        if(restaurant.calcAverageRateRestaurant >= min && restaurant.calcAverageRateRestaurant <= max){
            $('.'+restaurant.parsedRestaurantName).attr("style", "display: flex !important");
            restaurant.marker.setMap(map);
        } else {
            $('.'+restaurant.parsedRestaurantName).attr("style", "display: none !important");
            restaurant.marker.setMap(null);
        }
    });
}

/**
 *Affiche les restaurants visible sur la map dans la liste
 * @export
 */
export function displayVisibleRestaurantsOnMap(){
    const bds = map.getBounds();
    const South_Lat = bds.getSouthWest().lat();
    const South_Lng = bds.getSouthWest().lng();
    const North_Lat = bds.getNorthEast().lat();
    const North_Lng = bds.getNorthEast().lng();
    listRestaurants.forEach(restaurant => {
        if(restaurant.lat > South_Lat && restaurant.lat < North_Lat && restaurant.long > South_Lng && restaurant.long < North_Lng){
            $('.'+restaurant.parsedRestaurantName).attr("style", "display: flex !important");
            $('#input-select-min').prop('selectedIndex',0);
            $('#input-select-max').prop('selectedIndex',0);
            restaurant.marker.setMap(map);
        } else {
            $('.'+restaurant.parsedRestaurantName).attr("style", "display: none !important");
            $('#input-select-min').prop('selectedIndex',0);
            $('#input-select-max').prop('selectedIndex',0);
            restaurant.marker.setMap(null);
        }
    });
}
