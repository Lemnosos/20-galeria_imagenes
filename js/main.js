/**
 * @fileoverview Aplicación que consume la API de Pexels para mostrar imágenes
 * por categorías y gestionar una galería dinámica mediante delegación de eventos.
 */

/**
 * Clave de autenticación para la API de Pexels
 * @type {string}
 */
const key = "I1dugFYldajKvI1gCSdWrV5ftv1EP5QoeqogsQrz5Nlhll2UItZJAvPR";
let categoriaGlobal = ""
/**
 * Referencias a elementos del DOM principales
 * @type {HTMLElement}
 */
const figura1 = document.querySelector('#figura1');
const figura2 = document.querySelector('#figura2');
const figura3 = document.querySelector('#figura3');

/**
 * Array con las figuras principales
 * @type {HTMLElement[]}
 */
const figuras = [figura1, figura2, figura3];

// const catGeneral;

/**
 * Contenedor principal donde se renderizan las imágenes
 * @type {HTMLElement}
 */
const seccionPrincipal = document.querySelector("#seccionPrincipal");
const seccionGaleria = document.querySelector("#seccionGaleria");
let formularioPaginacion = document.querySelector("#formPaginacion")
let anteriorPaginacion = document.querySelector("#pagBtnAnterior")
let siguientePaginacion = document.querySelector("#pagBtnSiguiente")

/**
 * Fragmento reutilizable para inserciones eficientes en el DOM
 * @type {DocumentFragment}
 */
const fragmento = document.createDocumentFragment();

/**
 * Categorías disponibles para las imágenes
 * @type {string[]}
 */
const categorias = [
    { cat: "sci_fi", },
    { cat: "videogames" },
    { cat: "army" }];

/**
 * Número total de páginas disponibles según resultados
 * @type {number}
 */
let numeroBotones;

/**
 * Número de imágenes por página
 * @type {number}
 */
const imagenPorPagina = 9;
let pagina = 1;

const urlBase = 'https://api.pexels.com/v1'
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera una imagen aleatoria de una categoría
 * 
 * @param {string} categoria - Categoría de búsqueda
 * @returns {Promise<RespuestaPexels>}
 */
const form = document.getElementById("formBuscador")
const input = document.getElementById("inputBuscador")

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
        if (ev.target.matches('[data-categoria]')) {
            ev.preventDefault()
            categoriaGlobal = ev.target.dataset.categoria
            pintarGaleriaPrincipal(categoriaGlobal)
        }
    } catch (error) {
        console.log("Error al leer las nuevas fotos", error);
    }
});

siguientePaginacion.addEventListener("click", async (ev) => {
    console.log(ev.target)
    try {
        pagina++;
        if (pagina > numeroBotones)
            pagina = numeroBotones;
        const dataArray = await recuperarImagenes(categoriaGlobal, pagina)
        console.log("siguientePaginacion", dataArray, pagina)

        dataArray.forEach((data, i) => {
            pintarConCategoria(seccionGaleria, dataArray[i], categoriaGlobal);
        });

    } catch (error) {
        console.log(error);
    }

})

anteriorPaginacion.addEventListener("click", async (ev) => {
    console.log(ev.target)
    try {
        pagina--;
        if (pagina < 1)
            pagina = 1;
        const dataArray = await recuperarImagenes(categoriaGlobal, pagina)
        console.log("anteriorPaginacion", dataArray, pagina)

        dataArray.forEach((data, i) => {
            pintarConCategoria(seccionGaleria, dataArray[i], categoriaGlobal);
        });

    } catch (error) {
        console.log(error);
    }

})


/**
 * Recupera una imagen aleatoria de una categoría
 * 
 * @param {string} categoria - Categoría de búsqueda
 * @returns {Promise<RespuestaPexels>}
 */

// Search bar function
const formBuscador = document.getElementById("formBuscador")
const inputBuscador = document.getElementById("inputBuscador")
const resultadoBusqueda = document.getElementById("resultadoBuscador")

formBuscador.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const categoria = inputBuscador.value;

    pintarGaleriaPrincipal(categoria);
});

const pintarGaleriaPrincipal = async (categoria) => {

    const response = await fetch(
        `${urlBase}/search?query=${categoria}&per_page=${imagenPorPagina}`,
        {
            headers: {
                Authorization: key,
            },
        }
    );

    const data = await response.json();

    pintarPaginacion(data);

    seccionGaleria.innerHTML = ""
    data.photos.forEach((foto) => {
        pintarGaleria(seccionGaleria, foto, categoria)
    })

};

//buscar imagen aleatoria
const recuperarImagenAleatoria = async ({ cat }) => {
    try {
        let url = `${urlBase}/search?query=${cat}&per_page=1`
        const res = await fetch(url, {
            headers: {
                Authorization: key,
            }
        });
        console.log("recuperarImagenAleatoria", `${urlBase}/search?query=${cat}&per_page=1`)
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
 * Recupera un conjunto de imágenes de una categoría concreta
 * 
 * @param {string} categoria - Categoría de búsqueda
 * @returns {Promise<RespuestaPexels>}
 */
const recuperarImagenes = async (categoria, pagina) => {
    console.log("recuperar imagenes:", categoria, pagina, imagenPorPagina)
    try {
        console.log("recuperar imagenes busca:", `${urlBase}/search?query=${categoria}&per_page=${imagenPorPagina}&page=${pagina}`)
        let url = `${urlBase}/search?query=${categoria}&per_page=${imagenPorPagina}&page=${pagina}`
        const res = await fetch(url, {
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
 * Pinta una imagen con categoría dentro de una figura principal
 * 
 * @param {HTMLElement} figura - Contenedor destino
 * @param {RespuestaPexels} foto - Datos de la imagen
 * @param {string} categoria - Categoría asociada
 */
const pintarConCategoria = (figura, foto, categoria) => {
    if (!figura) return;

    figura.innerHTML = "";

    const img = document.createElement("img");
    img.src = foto.photos[0].src.medium;
    img.alt = foto.photos[0].alt;
    img.dataset.categoria = categoria

    const p = document.createElement('p');
    p.innerText = `Descripción de la imagen aleatoria de la categoria ${categoria}`;
    p.dataset.categoria = categoria

    fragmento.append(img, p);
    figura.append(fragmento);
    figura.dataset.categoria = categoria
};

/**
 * Pinta una imagen dentro de la galería principal
 * 
 * @param {HTMLElement} figura - Contenedor destino
 * @param {Imagen} foto - Objeto de imagen
 */
const pintarGaleria = (figura, foto, categoria) => {
    if (!figura) return;

    const div = document.createElement('div');
    div.dataset.categoria = categoriaGlobal;

    const divImg = document.createElement('div');
    divImg.classList.add('imgContainer');
    divImg.dataset.categoria = categoriaGlobal;

    const img = document.createElement("img");
    img.src = foto.src.medium;
    img.alt = foto.alt;
    img.dataset.categoria = categoriaGlobal;

    const p = document.createElement("p");
    p.textContent = foto.alt;
    p.dataset.categoria = categoriaGlobal;



    // para favoritos
    const btn = document.createElement("button");
    btn.innerText = "FAV";
    btn.onclick = () => toggleFav({ id: foto.id });


    divImg.append(img);
    div.append(divImg, p, btn); // Asegúrate de añadir el botón al div


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
            pintarConCategoria(figuras[i], dataArray[i], categorias[i].cat);
        });

    } catch (error) {
        console.log(error);
    }
};

const obtenerInputPaginado = () => {
    let input = document.querySelector("#inputPaginacion")
    let texto = input.value;
    return texto
}

//funcion de pintado de la paginacion
const pintarPaginacion = async (data) => {
    numeroBotones = Math.ceil(data.total_results / imagenPorPagina)
    console.log("nbotones", numeroBotones)
    formularioPaginacion.classList.remove("oculto")
    console.log("en pontar paginacion, data vale:", data)
    anteriorPaginacion.dataset.url = data.prev_page || "";
    siguientePaginacion.dataset.url = data.next_page || "";
}


// Favorite

const getFavs = () => JSON.parse(localStorage.getItem('favs')) || [];

const toggleFav = (foto) => {
    let favs = getFavs();
    const exists = favs.find(f => f.id === foto.id);

    if (!exists) {
        favs.push(foto);
        localStorage.setItem('favs', JSON.stringify(favs));
        renderFavs();
    }
}
// Si ya existe lo quita, si no, lo añade
//     favs = exists ? favs.filter(f => f.id !== foto.id) : [...favs, foto];

//     localStorage.setItem('favs', JSON.stringify(favs));
//     renderFavs(); 
//     // Actualiza la vista de favoritos
// };
const eliminarFav = (id) => {
    let favs = getFavs()
    favs = favs.filter(f => f.id !== id);
    localStorage.setItem('favs', JSON.stringify(favs));

    renderFavs();
};
const renderFavs = () => {
    const contenedor = document.querySelector("#contenedorFavoritos");
    const favs = getFavs();

    contenedor.innerHTML = "";

    favs.forEach(foto => {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = foto.src;
        img.alt = foto.alt;


        const p = document.createElement("p");
        p.textContent = foto.alt;


        const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "DEL FAV";

        btnEliminar.onclick = () => {
            eliminarFav(foto.id);

        };

        div.append(img, p, btnEliminar);
        contenedor.append(div);

    })

    // Aquí puedes decidir si quieres borrarlos o pintarlos en otro lado
    console.log("Tus favoritos actuales:", favs);
};
renderFavs();




/**
 * Inicializa la aplicación cargando las imágenes principales
 */
rellenarImagenesPrincipales();