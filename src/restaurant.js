import { map } from './map'
import * as templates from '../src/templates';
import * as restaurantjs from './restaurantEvents';
import './restaurantEvents.js';
import imageMarkerRestaurant from '../src/assets/images/marker_location_restaurant.png';
import { globalCommentRate } from './restaurantEvents';
import $ from 'jquery';

/**
 * @export
 * @class Restaurant
 */
export class Restaurant {
    /**
     *Creates an instance of Restaurant.
     * @param {*} placeId Nom du restaurant
     * @param {*} restaurantName Nom du restaurant
     * @param {*} address Adresse du restaurant
     * @param {*} lat Latitude du restaurant
     * @param {*} long Longitude du restaurant
     * @param {*} ratings Chaque commentaire est stocké dans un objet et ensuite dans un array
     * @param {*} averageRate Note moyenne du restaurant
     * @param {*} marker Marker instancié via l'api google maps
     * @param {*} reviewAdded Booléen pour savoir si des commentaires on déjà été utilisés
     * @param {*} calcAverageRateRestaurant Calcul de la note moyenne du restaurant
     *
     * @memberof Restaurant
     */
    constructor(placeId, restaurantName, address, lat, long, ratings, averageRate, marker, reviewAdded) {
        this.placeId = placeId;
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.ratings = ratings;
        this.averageRate = averageRate;
        this.marker = marker;
        this.reviewAdded = reviewAdded;
        this.calcAverageRateRestaurant;
    }
    /**
     *Calcul la note moyenne d'un restaurant
     * @readonly
     * @memberof Restaurant
     */
    get calcAverageRateRestaurant() {
        if (this.averageRate !== null) {
            this.averageRate = this.averageRate;
        } else if (this.ratings.length === 0) {
            this.averageRate = 0;
        } else {
            let total = 0;
            for (let i = 0; i < this.ratings.length; i++) {
                total += this.ratings[i].stars;
            }
            this.averageRate = (total / this.ratings.length).toFixed(1);
        }
    }
    /**
     *Modifie le nom du restaurant selon la regex
     * @readonly
     * @memberof Restaurant
     */
    get parsedRestaurantName() {
        return this.restaurantName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\//\s/]/gi, '');
    }
    /**
     *Affiche le marker du restaurant sur la map et affiche le restaurant dans la liste
     * @memberof Restaurant
     */
    displayRestaurant() {
        $('#list-restaurants').append(templates.addRestaurant(this.parsedRestaurantName, this.restaurantName, this.averageRate));
        const marker = new google.maps.Marker({
            position: {
                lat: this.lat,
                lng: this.long
            },
            map: map,
            icon: imageMarkerRestaurant
        });
        this.marker = marker;
        this.clickEventRestaurant();
    }
    /**
     * Recherche de commentaires correspondant à la requête
     * @memberof Restaurant
     */
    getReviewsRequest(){
        const placeDetailsRequest = {
            fields: ['reviews'],
            placeId: this.placeId
        };
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(placeDetailsRequest, (resultsDetails, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resultsDetails.reviews.forEach(review => {
                    this.ratings.push({
                        stars: review.rating,
                        comment: review.text
                    });
                    this.reviewAdded = true;
                });
                this.displayComments();
                this.commentValidation();
            } else {
                $('#map').append(templates.errorHandler('Erreur placeDetailsRequest: '+status));
            }
        });
    }
    /**
     *Permet d'afficher une modal avec les infos du resto et les reviews
     * @memberof Restaurant
     */
    clickEventRestaurant() {
        $('.' + this.parsedRestaurantName).off('click').on('click', () => {
            map.setCenter(this.marker.getPosition());
            map.setZoom(15);
            this.displayModal();
            (this.reviewAdded === false) ? this.getReviewsRequest() : this.displayComments();
        })
    }
    /**
     *Permet d'afficher la modal
     * @memberof Restaurant
     */
    displayModal() {
        $('.modal-body').empty();
        $('.modal-title').empty();
        $('#add-comment').empty();
        $('#modal-element').modal();
    }
    /**
     *Permet d'afficher les commentaires d'un restaurant
     * @memberof Restaurant
     */
    displayComments() {
        $('.modal-title').append(templates.contentHeaderComments(this.restaurantName, this.address, this.averageRate, this.parsedRestaurantName, this.lat, this.long));
        $('.modal-body').append(templates.contentBodyComments(this.ratings));
        $('#add-comment').append(templates.formComments());
        this.commentValidation();
        restaurantjs.ratingStars();
    }
    /**
     *Controle du formulaire de validation de commentaire
     * @memberof Restaurant
     */
    commentValidation() {
        $('#submit-comment').off('click').on('click', () => {
            const
                rate = globalCommentRate,
                comment = ($('#textarea-comm').val());
            $('.invalid-message').removeClass('visibility-hide');
            if (rate !== null && comment.length >= 3) {
                const rating = {
                    stars: parseInt(rate),
                    comment: comment
                };
                this.ratings.push(rating);
                $('.modal-body').empty();
                $('.modal-body').append(templates.contentBodyComments(this.ratings));
                $('#add-comment').empty();
                $('#add-comment').append(templates.contentBodyCommentsAdded());
                this.updateStarsRestaurant();
            } else {
                $('.invalid-message').html('<p>Veuillez ajouter une note et un commentaire avec au moins 3 caractères</p>');
                $('.invalid-message').addClass('visibility-show');
            }
        })
    }
    /**
     * Met à jour l'affichage de la note moyenne du restaurant
     * @memberof Restaurant
     */
    updateStarsRestaurant() {
        this.averageRate = (((this.averageRate * (this.ratings.length - 1)) + globalCommentRate ) / this.ratings.length).toFixed(1);
        $('.' + this.parsedRestaurantName + ' > span.badge')
            .empty()
            .append(this.averageRate);
        $('.' + this.parsedRestaurantName + '' + '-title > span.badge')
            .empty()
            .append('Note restaurant : ' + this.averageRate);
    }
}