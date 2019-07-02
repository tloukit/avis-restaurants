import { map } from './map'
import * as templates from '../src/templates';
import $ from 'jquery';

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
    constructor(restaurantName,address,lat,long,ratings){
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.ratings = ratings;
        this.marker = null;
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