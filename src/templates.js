/**
 *Template d'affichage d'erreur
 * @export
 * @param {*} error
 * @returns
 */
export function errorHandler(error) {
    $('#map').empty();
    let html = `
    <div class="error col-12 mt-4">
        <p>Nous avons rencontré une erreur d'exploitation sur notre site.</p>
        <p>Veuillez revenir ultérieurement.</p>
        <p>Si le problème persite, veuillez contacter l'administrateur du site.</p>
        <p>Veuillez nous excuser pour la gêne ocassionnée.</p>
        <p class="error-console"><b>Message d'erreur : ${error}</b></p>
    </div>`;
    return html;
}

/**
 *Template d'affichage d'ajout de restaurant
 * @export
 * @param {*} restaurantCSSClass classe css
 * @param {*} restaurantName nom du restaurant
 * @param {*} restaurantAverageRate note moyenne du restaurant
 * @returns
 */
export function addRestaurant(restaurantCSSClass, restaurantName, restaurantAverageRate) {
    let html = `
    <li class= "list-group-item d-flex justify-content-between align-items-center ${restaurantCSSClass}">
        ${restaurantName}
        <span class="badge badge-primary badge-pill">${restaurantAverageRate}</span>
    </li>`;
    return html;
}

/**
 *Template d'affichage de l'en tête des commentaires
 * @export
 * @param {*} restaurantName nom du restaurant
 * @param {*} restaurantAddress adresse du restaurant
 * @param {*} restaurantAverageRate note moyenne du restaurant
 * @param {*} restaurantCSSClass classe css
 * @param {*} restaurantLat latitude du restaurant
 * @param {*} restaurantLong longitude du restaurant
 * @returns
 */
export function contentHeaderComments(restaurantName, restaurantAddress, restaurantAverageRate, restaurantCSSClass, restaurantLat, restaurantLong) {
    let html = `
    <p class=${restaurantCSSClass}-title>
        <img class="img-streetview img-thumbnail" src="https://maps.googleapis.com/maps/api/streetview?location=${restaurantLat},${restaurantLong}&size=456x456&key=${process.env.GOOGLEMAPS_KEY}" alt="Image de${restaurantName}" />
        ${restaurantName}
        <span class="badge badge-primary text-wrap">Note restaurant : ${restaurantAverageRate}</span>
    </p>
    <p class="font-weight-lighter">${restaurantAddress}</p>
    `
    return html;
}

/**
 *Template d'affichage des commentaires d'un restaurant dans une modal
 * @export
 * @param {*} ratings un objet contenant un commentaire et une note
 * @returns
 */
export function contentBodyComments(ratings) {
    let i = 0;
    let html = '';
    while (i < ratings.length) {
        html += `
        <div class="content-body-comments">
            <p class="badge badge-primary text-wrap">Note ${ratings[i].stars}</p>
            <p>${ratings[i].comment}</p>
            <hr>
        </div>`
        i++;
    }
    return html;
}

/**
 *Template d'affichage d'un message de validation
 * @export
 * @returns
 */
export function contentBodyCommentsAdded() {
    let html = '<p class="mb-3 col-12"> Votre commentaire a bien été ajouté </p>';
    return html;
}

/**
 *Template d'affichage d'un formulaire de commentaires
 * @export
 * @returns
 */
export function formComments() {
    let html = `
        <div class="input-group mb-3 col-12">
            <div class="stars">
                <i class="icon ion-md-star s1"></i>
                <i class="icon ion-md-star s2"></i>
                <i class="icon ion-md-star s3"></i>
                <i class="icon ion-md-star s4"></i>
                <i class="icon ion-md-star s5"></i>
            </div>
        </div>
        <div class="form-group col-12">
            <label for="textarea-comm">Votre commentaire :</label>
            <textarea class="form-control" id="textarea-comm" rows="3"></textarea>
            <div class="invalid-message visibility-hide"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
            <button type="button" id="submit-comment" class="btn btn-primary">Publier</button>
        </div>
    `
    return html;
}



/**
 * Template d'affichage de l'en tête de la modal d'ajout de restaurants
 * @export
 * @returns
 */
export function headerAddRestaurant(position) {
    let html = `
        <p class="font-weight-lighter">
            <img class="img-streetview img-thumbnail" src="https://maps.googleapis.com/maps/api/streetview?location=${position.lat()},${position.lng()}&size=456x456&key=${process.env.GOOGLEMAPS_KEY}"/>
            <span class='title-addrestaurant'>Ajoutez le nom de votre restaurant</span>
        </p>
    `
    return html;
}


/**
 *Template d'affichage d'ajout de restaurant
 * @export
 * @returns
 */
export function formAddRestaurant() {
    let html = `
    <form>
        <div class="form-group">
            <label for="inputEmail4">Nom</label>
            <input type="email" class="form-control" id="form-name-restaurant" placeholder="Nom du restaurant">
            <div class="invalid-message visibility-hide"></div>
        </div>
        <div class="form-group">
            <label for="inputAddress">Adresse</label>
            <input type="text" class="form-control" id="form-address-restaurant" placeholder="Adresse du restaurant" disabled >
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="inputCity">Ville</label>
                <input type="text" class="form-control" id="form-city-restaurant" placeholder="Ville" disabled>
            </div>
            <div class="form-group col-md-6">
                <label for="inputZip">Code Postal</label>
                <input type="text" class="form-control" id="form-postalcode-restaurant" disabled>
            </div>
        </div>
        <button type="button" class="btn btn-primary" id="submit-restaurant">Ajouter</button>
        <button type="button" class="btn btn-secondary close-modal-restaurant" data-dismiss="modal">Fermer</button>
    </form>
    `
    return html
}