const key = I1dugFYldajKvI1gCSdWrV5ftv1EP5QoeqogsQrz5Nlhll2UItZJAvPR;

let figura1, figura2, figura3;

const categorias = ["sci_fi", "videogames", "army"]

//buscar imagen aleatoria
const recuperarImagenAleatoria = async (categoria) => {
    try {
        let res = await fetch(`https://api.pexels.com/v1/search?query=${categoria}&per_page=1`, {
            headers: {
                'Authorization': key,
            }
        })
        return res;
    } catch (error) {
        throw ('Error al buscar la imagen', error)
    }
}

//pintar una imagen(recibe un objeto cada vez)

//rellenar imagenes principales

//galeria de imagenes con la categoria

//buscar galeria por ID

//recuperar de localStorage
//guardar en localStorage
