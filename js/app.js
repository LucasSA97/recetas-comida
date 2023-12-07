function app() {

    const selectCaregorias = document.querySelector('#categorias')
    selectCaregorias.addEventListener('change', categoriaSeleccionada)

    const resultado = document.querySelector('#resultado')
    const modal = new bootstrap.Modal('#modal', {})

    obtenerCategorias()

    function obtenerCategorias() {
        const url = `https://www.themealdb.com/api/json/v1/1/categories.php`
        fetch(url)
            .then(res => res.json())
            .then(result => mostrarCategorias(result.categories))
    }

    function mostrarCategorias(categorias = []){
        categorias.forEach( categoria => {
            //const { strCategory } = categoria
            const option = document.createElement('OPTION')
            option.value = categoria.strCategory
            option.textContent = categoria.strCategory
            selectCaregorias.appendChild(option)   
        })
    }

    function categoriaSeleccionada(e){
        const categoria = e.target.value
        const url =  `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        fetch(url)
            .then(res =>res.json())
            .then(result => mostrarRecetas(result.meals))

    }

    function mostrarRecetas( recetas = []) {

        clearHtml(resultado)

        const heading = document.createElement('h2')
        heading.classList.add('text-black', 'text-center', 'my-5')
        heading.textContent = recetas.length ? 'Results:' : 'No Results'
        resultado.appendChild(heading)

        recetas.forEach(receta => {
            const { idMeal, strMeal, strMealThumb } = receta

            const recetaContainer = document.createElement('DIV')
            recetaContainer.classList.add('col-md-4')

            const recetaCard = document.createElement('DIV')
            recetaCard.classList.add('card', 'mb-4')

            //Importante que tenga su clase de bootstrap, alt, y src
            const recetaImg = document.createElement('IMG')
            recetaImg.classList.add('card-img-top')
            recetaImg.alt = `Imagen de la receta ${strMeal}`
            recetaImg.src = strMealThumb

            const recetaCardBody = document.createElement('DIV')
            recetaCardBody.classList.add('card-body')

            const recetaHeading = document.createElement('H3')
            recetaHeading.classList.add('card-title', 'mb-3')
            recetaHeading.textContent = strMeal

            const recetaButton = document.createElement('button')
            recetaButton.classList.add('btn', 'btn-danger', 'w-100')
            recetaButton.textContent = 'Ver Receta'
            recetaButton.dataset.bsTarget = '#modal'
            recetaButton.dataset.bsToggle = 'modal'
            recetaButton.onclick = function(){
                seleccionarReceta(idMeal)
            }

            recetaCardBody.appendChild(recetaHeading)
            recetaCardBody.appendChild(recetaButton)

            recetaCard.appendChild(recetaImg)
            recetaCard.appendChild(recetaCardBody)

            recetaContainer.appendChild(recetaCard)

            resultado.appendChild(recetaContainer)
        })
    }

    function seleccionarReceta(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
            .then(res => res.json())
            .then(result => mostrarRecetaId(result.meals[0]))
    }

    function mostrarRecetaId(receta) {
        const { idMeal, strInstructions, strMeal, strMealThumb} = receta
        //Añadimos el contenido al modal
        const modalTitle = document.querySelector('.modal .modal-title')
        const modalBody = document.querySelector('.modal .modal-body')

        modalTitle.textContent = strMeal
        modalBody.innerHTML = `
        <img class="img-fluid" src="${strMealThumb} alt="receta ${strMeal}" />
        <h3 class="my-3">Instructions</h3>
        <p>${strInstructions}</p>
        `

        modal.show()
    }



    function clearHtml(select) {
        while(select.firstChild){
            select.removeChild(select.firstChild)
        }
    }






}

document.addEventListener('DOMContentLoaded' , app)