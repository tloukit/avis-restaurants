// PROMISE FETCH AVEC PROMISE RACE + LIENS DANS UN TABLEAU
import $ from 'jquery'
import { initGMap } from '../src/map'
import { errorHandler } from '../src/templates'

export let listRestaurantsJson;
// Liste des restaurants JSON récupérée

// Liste des différents mirroirs contenant les fichiers json (avec les mêmes données dans chaque JSON)
const
    fetchRequestMirror1 = fetch('http://steventchakpe.com/openclassrooms/restaurants.json'),
    fetchRequestMirror2 = fetch('https://api.myjson.com/bins/z9ern'),
    fetchRequestMirror3 = fetch('https://api.jsonbin.io/b/5cf254d53185c64c762aca1e/1');

// Promise qui retourne un reject à la fin du délai
const timeout = new Promise((resolve, reject) => {
    return setTimeout(() => reject(new Error('request timeout')), 10000);
});

// Promise race contenant les 4 promise dans un tableau la première reqûete qui répond passe dans le pipe 'then'
const promiseRace = Promise.race([fetchRequestMirror1, fetchRequestMirror2, fetchRequestMirror3, timeout])
    .then(function (response) {
        response.json()
            .then(function (value) {
                listRestaurantsJson = value;
            })
            .then((initGMap()));
    })

// Execution de la promise race et catch si erreur retournée puis affichage du template 'errorHandler'
promiseRace.catch(error => $('#map').append(errorHandler(error)));