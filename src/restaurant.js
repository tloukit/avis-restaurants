import { map } from './map'
import * as templates from '../src/templates';
import './restaurantEvents.js';
import imageMarkerRestaurant from '../src/assets/images/marker_location_restaurant.png';
import $ from 'jquery';

/**
 * @export
 * @class Restaurant
 */
export class Restaurant{
    /**
     *Creates an instance of Restaurant.
     * @param {*} restaurantName Nom du restaurant
     * @param {*} address Adresse du restaurant
     * @param {*} lat Latitude du restaurant
     * @param {*} long Longitude du restaurant
     * @param {*} ratings Chaque commentaire est stocké dans un objet et ensuite dans un array
     * @param {*} marker Marker instancié via l'api google maps
     *
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
     *Calcul la note moyenne d'un restaurant
     * @readonly
     * @memberof Restaurant
     */
    get calcAverageRateRestaurant(){

        if(this.ratings.length === 0){
            return 0;
        } else {
            let total = 0;
            for (let i = 0; i < this.ratings.length; i++){
                total += this.ratings[i].stars;
            }
            return (total / this.ratings.length).toFixed(1);
        }
    }
    /**
     *Modifie le nom du restaurant selon la regex
     * @readonly
     * @memberof Restaurant
     */
    get parsedRestaurantName(){
        return this.restaurantName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\//\s/]/gi, '');
    }
    /**
     *Affiche le marker du restaurant sur la map et affiche le restaurant dans la liste
     * @memberof Restaurant
     */
    displayRestaurant(){
        console.log('Commentaires',this.ratings);
        console.log('Note moy du resto',this.calcAverageRateRestaurant);
        $('#list-restaurants').append(templates.addRestaurant(this.parsedRestaurantName,this.restaurantName,this.calcAverageRateRestaurant));
        const marker = new google.maps.Marker({
            position: {
                lat: this.lat,
                lng: this.long
            },
            map: map,
            icon:imageMarkerRestaurant
        });
        this.marker = marker;
        this.clickEventRestaurant();
    }
    /**
     *Permet d'afficher une modal avec les infos du resto et les reviews
     * @memberof Restaurant
     */
    clickEventRestaurant(){
        $('.' + this.parsedRestaurantName).off('click').on('click', () => {
            map.setCenter(this.marker.getPosition());
            map.setZoom(15);
            this.displayModal()
            this.displayComments()
            this.commentValidation();
        })
    }
    /**
     *Permet d'afficher la modal
     * @memberof Restaurant
     */
    displayModal(){
        $('.modal-body').empty();
        $('.modal-title').empty();
        $('#add-comment').empty();
        $('#modal-element').modal();
    }
    /**
     *Permet d'afficher les commentaires d'un restaurant
     * @memberof Restaurant
     */
    displayComments(){
        $('.modal-title').append(templates.contentHeaderComments(this.restaurantName,this.address,this.calcAverageRateRestaurant,this.parsedRestaurantName,this.lat,this.long));
        $('.modal-body').append(templates.contentBodyComments(this.ratings));
        $('#add-comment').append(templates.formComments());
    }
    /**
     *Controle du formulaire de validation de commentaire
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
                this.ratings.push(rating);
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
     * Met à jour l'affichage de la note moyenne du restaurant
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
