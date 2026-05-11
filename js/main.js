const key = "I1dugFYldajKvI1gCSdWrV5ftv1EP5QoeqogsQrz5Nlhll2UItZJAvPR";

let figura1 = document.querySelector('#figura1')
let figura2 = document.querySelector('#figura2')
let figura3 = document.querySelector('#figura3')
let figuras = [figura1, figura2, figura3]

const seccionPrincipal = document.querySelector("#seccionPrincipal")

let fragmento = document.createDocumentFragment()

const categorias = ["sci_fi", "videogames", "army"]

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENTOS
document.addEventListener("click", async (ev) => {
    try {
        let cat = ev.target.closest('[id*="figura"]').childNodes[0].dataset.categoria
        let res = await recuperarImagenes(cat)
        let imagenes = res.photos

        seccionPrincipal.innerHTML = ""

        imagenes.forEach((imagen) => {
            pintarSinCategoria(seccionPrincipal, imagen);
        })
    } catch (error) {
        console.log("Error al leer las nuevas fotos", error)
    }

})


//buscar imagen aleatoria
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

//pintar una imagen(recibe un objeto cada vez)
const pintarConCategoria = (figura, foto, categoria) => {
    if (!figura) return;

    figura.innerHTML = "";

    const div = document.createElement('div')
    div.classList.add('imgContainer')
    div.dataset.categoria = categoria;

    const img = document.createElement("img");
    img.src = foto.photos[0].src.medium;
    img.alt = foto.photos[0].alt;
    div.append(img)

    const p = document.createElement('p')
    p.innerText = `Descripción de la imagen aleatoria de la categoria ${categoria}`

    fragmento.append(div, p)

    figura.append(fragmento);
};

const pintarSinCategoria = (figura, foto) => {

    if (!figura) return;

    const div = document.createElement('div')

    const divImg = document.createElement('div')
    divImg.classList.add('imgContainer')

    const img = document.createElement("img");
    img.src = foto.src.medium;
    img.alt = foto.alt;
    div.append(img)

    const p = document.createElement("p")
    p.textContent = foto.alt

    divImg.append(img)

    div.append(divImg, p)

    figura.append(div);
}

//rellenar imagenes principales
const rellenarImagenesPrincipales = async () => {
    try {
        let cat;
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

//galeria de imagenes con la categoria(recibe donde y el q)
const recuperarImagenes = async (categoria) => {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${categoria}&per_page=15&page=1`, {
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
}

//buscar galeria por ID

//recuperar de localStorage
//guardar en localStorage






//llamadas de inicio
rellenarImagenesPrincipales()