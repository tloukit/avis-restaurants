//Template d'erreur
/**
 *
 *
 * @export
 * @param {*} error
 * @returns
 */
export function errorHandler(error){
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
 *
 *
 * @export
 * @param {*} restaurantCSSClass
 * @param {*} restaurantName
 * @param {*} restaurantAverageRate
 * @returns
 */
export function addRestaurant(restaurantCSSClass,restaurantName,restaurantAverageRate){
    let html = `
    <li class= "list-group-item d-flex justify-content-between align-items-center ${restaurantCSSClass}">
        ${restaurantName}
        <span class="badge badge-primary badge-pill">${restaurantAverageRate}</span>
    </li>`;
    return html;
}

//Template d'affichage de l'en tête des commentaires
/**
 *
 *
 * @export
 * @param {*} restaurantName
 * @param {*} restaurantAddress
 * @param {*} restaurantAverageRate
 * @param {*} restaurantCSSClass
 * @param {*} restaurantLat
 * @param {*} restaurantLong
 * @returns
 */
export function contentHeaderComments(restaurantName,restaurantAddress,restaurantAverageRate,restaurantCSSClass,restaurantLat,restaurantLong){
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

//Template d'affichage des commentaires d'un restaurant dans une modal
/**
 *
 *
 * @export
 * @param {*} ratings
 * @returns
 */
export function contentBodyComments(ratings){
    let i = 0;
    let html = '';
    while (i < ratings.length){
        html += `
        <div class="content-body-comments">
            <p class="badge badge-primary text-wrap">Note ${ratings[i].stars}</p>
            <p>${ratings[i].comment}</p>
            <hr>
        </div>`
        i ++;
    }
    return html;
}

/**
 *
 *
 * @export
 * @returns
 */
export function contentBodyCommentsAdded(){
    let i = 0;
    let html = '<p> Votre commentaire a été ajouté </p>';
    return html;
}

//Template d'affichage d'un formulaire de commentaires
/**
 *
 *
 * @export
 * @returns
 */
export function formComments(){
    let html = `
        <div class="input-group mb-3 col-12">
        <div class="input-group-prepend">
            <label class="input-group-text" for="input-select-rate">Note</label>
        </div>
        <select class="custom-select" id="input-select-rate">
            <option selected="selected">Séléctionnez une note</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        </div>
        <div class="form-group col-12">
                <label for="textarea-comm">Votre commentaire :</label>
                <textarea class="form-control" id="textarea-comm" rows="3"></textarea>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" id="submit-comment" class="btn btn-primary">Publier</button>
        </div>
    `
    return html;
}


//Template d'affichage de l'en tête de la modal d'ajout de restaurants
/**
 *
 *
 * @export
 * @returns
 */
export function headerAddRestaurant(){
    let html = `
    <p class="font-weight-lighter">Ajoutez les données de votre restaurant</p>
    `
    return html;
}


/**
 *
 *
 * @export
 * @returns
 */
export function formAddRestaurant(){
    let html = `
    <form>
        <div class="form-group">
            <label for="inputEmail4">Nom</label>
            <input type="email" class="form-control" id="form-name-restaurant" placeholder="Nom du restaurant">
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
    </form>
    `
    return html
}