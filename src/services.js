// PROMISE FETCH AVEC PROMISE RACE + LIENS DANS UN TABLEAU
import $ from 'jquery'
import { initGMap } from '../src/map'
import { errorHandler } from '../src/templates'

// Liste des restaurants JSON récupérée
let urlJson = require('./assets/json/restaurants.json');

// Liste des différents mirroirs contenant les fichiers json (avec les mêmes données dans chaque JSON)
const fetchUrlJson = fetch(urlJson);

// Promise qui retourne un reject à la fin du délai
const timeout = new Promise((reject) => {
    return setTimeout(() => reject(new Error('request timeout')), 10000);
});
// Promise race contenant les 2 promise dans un tableau la première reqûete qui répond passe dans le pipe 'then'
export const promiseRace = Promise.race([fetchUrlJson, timeout])
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    })
    .then((value) => {
        jsonFile = value;
    });

export let jsonFile;


// Execution de la promise race et catch si erreur retournée puis affichage du template 'errorHandler'
promiseRace.then((initGMap())).catch(error => $('#map').append(errorHandler(error)));