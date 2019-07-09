import { map } from './map'
import * as templates from '../src/templates';
import { listRestaurants } from './map';
import $ from 'jquery';

/**
 * Variables globales 
 */
let globalTempMarker = null;
let globalTempAddress = null;

/**
 *
 *
 * @export
 * @class Restaurant
 */
export class Restaurant{
    /**
     *Creates an instance of Restaurant.
     * @param {*} restaurantName
     * @param {*} address
     * @param {*} lat
     * @param {*} long
     * @param {*} ratings
     * @memberof Restaurant
     */
    constructor(restaurantName,address,lat,long,ratings,marker){
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.ratings = ratings;
        this.marker = marker;
    }
    /**
     *
     *
     * @readonly
     * @memberof Restaurant
     */
    get calcAverageRateRestaurant(){
        let total = 0;
        for (let i = 0; i < this.ratings.length; i++){
            total += this.ratings[i].stars;
        }
        return total / this.ratings.length;
    }
    /**
     *
     *
     * @readonly
     * @memberof Restaurant
     */
    get parsedRestaurantName(){
        return this.restaurantName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\//\s/]/gi, '');
    }
    /**
     *
     *
     * @memberof Restaurant
     */
    displayRestaurant(){
        $('#list-restaurants').append(templates.addRestaurant(this.parsedRestaurantName,this.restaurantName,this.calcAverageRateRestaurant));
        const marker = new google.maps.Marker({
            position: {
                lat: this.lat,
                lng: this.long
            },
            map: map
        });
        this.marker = marker;
        this.clickEventRestaurant();
    }
    /**
     *
     *
     * @memberof Restaurant
     */
    clickEventRestaurant(){
        $('.' + this.parsedRestaurantName).off('click').on('click', () => {
            console.log('Nom du restaurant',this.restaurantName);
            map.setCenter(this.marker.getPosition());
            map.setZoom(15);
            this.displayModal()
            this.displayComments()
            this.commentValidation();
        })
    }
    /**
     *
     *
     * @memberof Restaurant
     */
    displayModal(){
        $('.modal-body').empty();
        $('.modal-title').empty();
        $('#add-comment').empty();
        $('#modal-element').modal();
    }
    /**
     *
     *
     * @memberof Restaurant
     */
    displayComments(){
        $('.modal-title').append(templates.contentHeaderComments(this.restaurantName,this.address,this.calcAverageRateRestaurant,this.parsedRestaurantName,this.lat,this.long));
        $('.modal-body').append(templates.contentBodyComments(this.ratings));
        $('#add-comment').append(templates.formComments());
        console.log(this.ratings);
    }
    /**
     *
     *
     * @memberof Restaurant
     */
    commentValidation(){
        $('#submit-comment').off('click').one('click',() => {
            const
            rate = $('#input-select-rate').val(),
            comment = ($('#textarea-comm').val());
            if(rate.toString().length === 1 && comment.length >= 3){
                const rating = {
                    stars:parseInt(rate),
                    comment:comment
                };
                console.log(rating);
                this.ratings.push(rating);
                console.log(this.ratings);
                $('.modal-body').empty();
                $('.modal-body').append(templates.contentBodyComments(this.ratings));
                $('.modal-body').animate({ scrollTop: $('.modal-body').height() }, 10000);
                $('#add-comment').empty();
                $('#add-comment').append(templates.contentBodyCommentsAdded());
                this.updateStarsRestaurant();
            } else {
                //CAS D'ERREUR A AJOUTER
                console.log('Entrées non valides !');
            }
        })
    }
    /**
     *
     *
     * @memberof Restaurant
     */
    updateStarsRestaurant() {
        $('.'+this.parsedRestaurantName+' > span.badge')
        .empty()
        .append(this.calcAverageRateRestaurant);

        $('.'+this.parsedRestaurantName+''+'-title > span.badge')
        .empty()
        .append('Note du restaurant : '+this.calcAverageRateRestaurant);
    }
}

/**
 *
 *
 * @export
 */
export function addMarker (){
    $('#add-restaurant').off('click').on('click',function() {
        $('.border-map').removeClass('border-secondary ');
        $('.border-map').addClass('border-primary');
        let mark = map.addListener('click', (e) => {
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
 *
 *
 */
function displayModalRestaurant () {
    $('#modal-element').modal();
    $('.modal-body,.modal-title,#add-comment').empty();
    $('.modal-title').append(templates.headerAddRestaurant);
    $('.modal-body').append(templates.formAddRestaurant);
}

//Fonction permettant de récupérer l'adresse du lieu qui a été cliqué sur la map
/**
 *
 *
 * @param {*} geocoder
 * @param {*} map
 * @param {*} position
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

//L'adresse récupérée est affiché dans des input disabled dans la fonction suivante
/**
 *
 *
 * @param {*} splittedAdd
 * @param {*} latLng
 */
function addAdressToInput (splittedAdd,latLng){
    let cityAndPostalcode = splittedAdd[1].split(' ');
    $("#form-address-restaurant").attr("placeholder", splittedAdd[0]);
    $("#form-city-restaurant").attr("placeholder", cityAndPostalcode[2]);
    $("#form-postalcode-restaurant").attr("placeholder", cityAndPostalcode[1]);
    restaurantValidation(latLng);
}

/**
 *
 *
 * @param {*} latLng
 */
function restaurantValidation(latLng){
    $('#submit-restaurant').off('click').one('click',function() {
        const latlngJson = latLng.toJSON();
        const restaurantName = $('#form-name-restaurant').val();
        listRestaurants.push(new Restaurant(restaurantName,globalTempAddress,latlngJson.lat,latlngJson.lng,[],globalTempMarker));
        console.log(listRestaurants.slice(-1).pop().displayRestaurant());
        console.log(listRestaurants);
    })
}

function requestNearbyRestaurants(lat,lng){
    const requestUrl = ''
}
