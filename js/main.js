/**
 * @fileoverview Aplicación que consume la API de Pexels para mostrar imágenes
 * por categorías y gestionar una galería dinámica mediante delegación de eventos.
 */

/**
 * Clave de autenticación para la API de Pexels
 * @type {string}
 */
const key = "I1dugFYldajKvI1gCSdWrV5ftv1EP5QoeqogsQrz5Nlhll2UItZJAvPR";

/**
 * Referencias a elementos del DOM principales
 * @type {HTMLElement}
 */
let figura1 = document.querySelector('#figura1');
let figura2 = document.querySelector('#figura2');
let figura3 = document.querySelector('#figura3');

/**
 * Array con las figuras principales
 * @type {HTMLElement[]}
 */
let figuras = [figura1, figura2, figura3];

/**
 * Contenedor principal donde se renderizan las imágenes
 * @type {HTMLElement}
 */
const seccionPrincipal = document.querySelector("#seccionPrincipal");

/**
 * Fragmento reutilizable para inserciones eficientes en el DOM
 * @type {DocumentFragment}
 */
let fragmento = document.createDocumentFragment();

/**
 * Categorías disponibles para las imágenes
 * @type {string[]}
 */
const categorias = ["sci_fi", "videogames", "army"];

/**
 * Número total de páginas disponibles según resultados
 * @type {number}
 */
let numeroBotones;

/**
 * Número de imágenes por página
 * @type {number}
 */
let imagenPorPagina = 15;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} ImagenSrc
 * @property {string} original
 * @property {string} large
 * @property {string} medium
 */

/**
 * @typedef {Object} Imagen
 * @property {ImagenSrc} src
 * @property {string} alt
 */

/**
 * @typedef {Object} RespuestaPexels
 * @property {Imagen[]} photos
 * @property {number} total_results
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Maneja los clicks en el documento mediante delegación de eventos.
 * Detecta si se ha hecho click sobre una figura y carga imágenes de su categoría.
 * 
 * @param {MouseEvent} ev - Evento de click
 */
document.addEventListener("click", async (ev) => {
    try {
        const figura = ev.target.closest('[id^="figura"]');
        if (!figura) return;

        const cat = figura.childNodes[0].dataset.categoria;

        const res = await recuperarImagenes(cat);
        const imagenes = res.photos;

        seccionPrincipal.innerHTML = "";

        imagenes.forEach((imagen) => {
            pintarSinCategoria(seccionPrincipal, imagen);
        });

    } catch (error) {
        console.log("Error al leer las nuevas fotos", error);
    }
});

/**
 * Recupera una imagen aleatoria de una categoría
 * 
 * @param {string} categoria - Categoría de búsqueda
 * @returns {Promise<RespuestaPexels>}
 */
const recuperarImagenAleatoria = async (categoria) => {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${categoria}&per_page=1`, {
            headers: {
                Authorization: key,
            }
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        if (!data.photos || data.photos.length === 0) {
            throw new Error("No hay fotos en la respuesta");
        }

        return data;

    } catch (error) {
        throw new Error(`Error al buscar la imagen: ${error.message}`);
    }
};

/**
 * Pinta una imagen con categoría dentro de una figura principal
 * 
 * @param {HTMLElement} figura - Contenedor destino
 * @param {RespuestaPexels} foto - Datos de la imagen
 * @param {string} categoria - Categoría asociada
 */
const pintarConCategoria = (figura, foto, categoria) => {
    if (!figura) return;

    figura.innerHTML = "";

    const div = document.createElement('div');
    div.classList.add('imgContainer');
    div.dataset.categoria = categoria;

    const img = document.createElement("img");
    img.src = foto.photos[0].src.medium;
    img.alt = foto.photos[0].alt;

    div.append(img);

    const p = document.createElement('p');
    p.innerText = `Descripción de la imagen aleatoria de la categoria ${categoria}`;

    fragmento.append(div, p);
    figura.append(fragmento);
};

/**
 * Pinta una imagen dentro de la galería principal
 * 
 * @param {HTMLElement} figura - Contenedor destino
 * @param {Imagen} foto - Objeto de imagen
 */
const pintarSinCategoria = (figura, foto) => {
    if (!figura) return;

    const div = document.createElement('div');

    const divImg = document.createElement('div');
    divImg.classList.add('imgContainer');

    const img = document.createElement("img");
    img.src = foto.src.medium;
    img.alt = foto.alt;

    const p = document.createElement("p");
    p.textContent = foto.alt;

    divImg.append(img);
    div.append(divImg, p);

    figura.append(div);
};

/**
 * Rellena las figuras principales con imágenes aleatorias de cada categoría
 * 
 * @returns {Promise<void>}
 */
const rellenarImagenesPrincipales = async () => {
    try {
        const dataArray = await Promise.all(
            categorias.map(cat => recuperarImagenAleatoria(cat))
        );

        dataArray.forEach((data, i) => {
            pintarConCategoria(figuras[i], dataArray[i], categorias[i]);
        });

    } catch (error) {
        console.log(error);
    }
};

/**
 * Recupera un conjunto de imágenes de una categoría concreta
 * 
 * @param {string} categoria - Categoría de búsqueda
 * @returns {Promise<RespuestaPexels>}
 */
const recuperarImagenes = async (categoria) => {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${categoria}&per_page=${imagenPorPagina}&page=1`, {
            headers: {
                Authorization: key,
            }
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        numeroBotones = Math.ceil(data.total_results / imagenPorPagina);

        if (!data.photos || data.photos.length === 0) {
            throw new Error("No hay fotos en la respuesta");
        }

        return data;

    } catch (error) {
        throw new Error(`Error al buscar la imagen: ${error.message}`);
    }
};

/**
 * Inicializa la aplicación cargando las imágenes principales
 */
rellenarImagenesPrincipales();