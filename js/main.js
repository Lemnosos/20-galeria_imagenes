//////////////////////////////////////////////////////////////////
// CONSTANTES
//////////////////////////////////////////////////////////////////

const key = "I1dugFYldajKvI1gCSdWrV5ftv1EP5QoeqogsQrz5Nlhll2UItZJAvPR";
const urlBase = 'https://api.pexels.com/v1';

let categoriaGlobal = "";
let numeroBotones = 1;
let pagina = 1;

const imagenPorPagina = 9;

const figuras = [
    document.querySelector('#figura1'),
    document.querySelector('#figura2'),
    document.querySelector('#figura3')
];

const seccionGaleria = document.querySelector("#seccionGaleria");

const formularioPaginacion = document.querySelector("#formPaginacion");
const anteriorPaginacion = document.querySelector("#pagBtnAnterior");
const siguientePaginacion = document.querySelector("#pagBtnSiguiente");
const inputPaginacion = document.querySelector("#inputPaginacion");

const formBuscador = document.getElementById("formBuscador");
const inputBuscador = document.getElementById("inputBuscador");

const categorias = [
    { cat: "sci_fi" },
    { cat: "videogames" },
    { cat: "army" }
];

//////////////////////////////////////////////////////////////////
// EVENTOS
//////////////////////////////////////////////////////////////////

document.addEventListener("click", (ev) => {
    if (ev.target.matches('[data-categoria]')) {
        ev.preventDefault();
        categoriaGlobal = ev.target.dataset.categoria;
        pagina = 1;
        pintarGaleriaPrincipal(categoriaGlobal);
    }


});

siguientePaginacion.addEventListener("click", () => cambiarPagina(1));
anteriorPaginacion.addEventListener("click", () => cambiarPagina(-1));

formBuscador.addEventListener("submit", (ev) => {
    ev.preventDefault();
    categoriaGlobal = inputBuscador.value;
    pagina = 1;
    pintarGaleriaPrincipal(categoriaGlobal);
});

//////////////////////////////////////////////////////////////////
// API
//////////////////////////////////////////////////////////////////

const fetchPexels = async (url) => {
    const res = await fetch(url, {
        headers: { Authorization: key }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return res.json();
};

const recuperarImagenAleatoria = async (categoria) => {
    const url = `${urlBase}/search?query=${categoria}&per_page=1`;
    const data = await fetchPexels(url);
    return data.photos[0];
};

const recuperarImagenes = async (categoria, pagina) => {
    const url = `${urlBase}/search?query=${categoria}&per_page=${imagenPorPagina}&page=${pagina}`;
    const data = await fetchPexels(url);

    numeroBotones = Math.ceil(data.total_results / imagenPorPagina);

    return data.photos;
};

/**
 * Recupera una foto de Pexels por su ID
 * @param {number} id - ID de la imagen en Pexels
 * @returns {Promise<Imagen>}
 */
const recuperarImagenPorId = async (id) => {
    const url = `${urlBase}/photos/${id}`;

    const res = await fetch(url, {
        headers: {
            Authorization: key
        }
    });

    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status} al recuperar la imagen con ID ${id}`);
    }

    const data = await res.json();

    return data;
};

//////////////////////////////////////////////////////////////////
// PINTADO
//////////////////////////////////////////////////////////////////

const pintarGaleriaPrincipal = async (categoria) => {
    const fotos = await recuperarImagenes(categoria, pagina);

    pintarPaginacion();

    seccionGaleria.innerHTML = "";

    fotos.forEach(foto => {
        pintarGaleria(foto);
    });
};

const pintarGaleria = (foto) => {
    const div = document.createElement('div');

    const divImg = document.createElement('div');
    divImg.classList.add('imgContainer');

    const img = document.createElement("img");
    img.src = foto.src.medium;
    img.alt = foto.alt;

    const p = document.createElement("p");
    p.textContent = foto.alt; // 👈 AQUÍ EL CAMBIO IMPORTANTE

    const btn = document.createElement("button");
    btn.innerText = "FAV";
    btn.onclick = () => toggleFav({ id: foto.id });

    divImg.append(img);
    div.append(divImg, p, btn);

    seccionGaleria.append(div);
};

const pintarConCategoria = (contenedor, foto, categoria) => {
    contenedor.innerHTML = "";

    const img = document.createElement("img");
    img.src = foto.src.medium;
    img.alt = foto.alt;
    img.dataset.categoria = categoria;

    const p = document.createElement('p');
    p.innerText = `Imagen aleatoria de la categoría ${categoria}`;
    p.dataset.categoria = categoria;

    contenedor.append(img, p);
    contenedor.dataset.categoria = categoria;
};

const pintarPaginacion = () => {
    formularioPaginacion.classList.remove("oculto");

    anteriorPaginacion.disabled = pagina === 1;
    siguientePaginacion.disabled = pagina === numeroBotones;

    inputPaginacion.value = pagina;
};

//////////////////////////////////////////////////////////////////
// PAGINACIÓN
//////////////////////////////////////////////////////////////////

const cambiarPagina = (direccion) => {
    pagina += direccion;

    if (pagina < 1) pagina = 1;
    if (pagina > numeroBotones) pagina = numeroBotones;

    pintarGaleriaPrincipal(categoriaGlobal);
};


//////////////////////////////////////////////////////////////////
// FAVORITOS
//////////////////////////////////////////////////////////////////

const getFavs = () => JSON.parse(localStorage.getItem('favs')) || [];

const toggleFav = (foto) => {
    let favs = getFavs();
    const exists = favs.find(f => f.id === foto.id);

    if (!exists) {
        favs.push(foto);
        localStorage.setItem('favs', JSON.stringify(favs));
        renderFavs();
    }
};

const eliminarFav = (id) => {
    let favs = getFavs();
    favs = favs.filter(f => f.id !== id);
    localStorage.setItem('favs', JSON.stringify(favs));
    renderFavs();
};

const renderFavs = async () => {
    const contenedor = document.querySelector("#contenedorFavoritos");
    const favs = getFavs();

    contenedor.innerHTML = "";

    const fotos = await Promise.all(
        favs.map(f => recuperarImagenPorId(f.id))
    );

    fotos.forEach(foto => {
        const div = document.createElement("div");

        const img = document.createElement("img");
        img.src = foto.src.medium;
        img.alt = foto.alt;

        const p = document.createElement("p");
        p.textContent = foto.alt;

        const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "DEL FAV";
        btnEliminar.onclick = () => eliminarFav(foto.id);

        div.append(img, p, btnEliminar);
        contenedor.append(div);
    });
};


//////////////////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////////////////

const rellenarImagenesPrincipales = async () => {
    const fotos = await Promise.all(
        categorias.map(c => recuperarImagenAleatoria(c.cat))
    );

    fotos.forEach((foto, i) => {
        pintarConCategoria(figuras[i], foto, categorias[i].cat);
    });
};

renderFavs();
rellenarImagenesPrincipales();