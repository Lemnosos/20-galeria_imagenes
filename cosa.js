
const catGeneral;

const arrayCategorias = [
    {
        id: 8108391,
        categoria: 'naturaleza'
    }]

const urlBase = 'https://api.pexels.com/v1'

document.addEventListener((ev) => {

    if (ev.target.matches('[data-categoria]')) {
        categoria = ev.target.dataset('categoria')
        console.log(categoria)
        pintarGaleriaPrincipal(categoria)
    }



})

xxxx.addEventListener('submit', (ev) => {
    ev.preventDefailt()

    categoria = ev.target.input.value
    pintarGaleriaPrincipal()

})

const consultaApi = (url) => {

    try {
        const respuesta = await(fetch(`${urlBase}/${url}`))

    } catch (error) {

    }
    return respuesta
}

const pintarCatInicio = async () => {

    arrayCategorias.forEach(({ id, categoria }) => {

        const url = `photos/${id}`
        const dagta = await consultaApi(url)

        const caja = document.createElement('figure')

    })

}


const pintarGaleriaPrincipal = (categoria, pagina = 1) => {
    seccionPrincipal.innerHTML = "";


    const url = `search?query=${categoria}&per_page=${imagenPorPagina}&page=${pagina}`
    const dagta = await consultaApi(url)

}

const paginacion = () => {

    pintarGaleriaPrincipal(categoria, pagina)

}

pintarCatInicio()