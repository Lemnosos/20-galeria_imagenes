// const catGeneral;


const key = "I1dugFYldajKvI1gCSdWrV5ftv1EP5QoeqogsQrz5Nlhll2UItZJAvPR";

let figura1, figura2, figura3;

const categorias = ["sci_fi", "videogames", "army"]


const form = document.getElementById("formBuscador")
const input = document.getElementById("inputBuscador")

form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const categoria = input.value;

    pintarGaleriaPrincipal(categoria);
});

form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const categoria = input.value.trim();

    pintarGaleriaPrincipal(categoria);
});

const pintarGaleriaPrincipal = async (categoria) => {

    const response = await fetch(
        `https://api.pexels.com/v1/search?query=${categoria}&per_page=9`,
        {
            headers: {
                Authorization: key,
            },
        }
    );

    const data = await response.json();

    console.log(data.photos);


};





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
const pintar = (figura, foto) => {
    if (!figura) return;

    figura.innerHTML = "";

    const div = document.createElement('div')
    div.classList.add('imgContainer')

    const img = document.createElement("img");
    img.src = foto.src.medium;
    img.alt = foto.alt;
    div.append(img)

    const p = document.createElement('p')
    p.innerText = "descripción de la imagen aleatoria de la categoria"

    figura.appendChild(div, p);
};

//rellenar imagenes principales
const rellenarImagenesPrincipales = async () => {
    try {
        const dataArray = await Promise.all(
            categorias.map(cat => recuperarImagenAleatoria(cat))
        );

        dataArray.forEach((data, i) => {
            pintar(figuras[i], data.photos[0]);
        });

    } catch (error) {
        console.log(error);
    }
};
//galeria de imagenes con la categoria(recibe donde y el q)

//buscar galeria por ID

//recuperar de localStorage
//guardar en localStorage






//llamadas de inicio
rellenarImagenesPrincipales()
