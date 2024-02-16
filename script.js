const API_KEY = 'api_key=f983f1a73e02ec0fd3c6c40e9180ffa5';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', function() {
    const main = document.getElementById('main');
    const peliModal = new bootstrap.Modal(document.getElementById('peliModal'));

    main.addEventListener('click', (event) => {
        const targetCard = event.target.closest('.peli-card');
        if (targetCard) {
            const movieId = targetCard.dataset.movieId; 
            const movieDetailsURL = `${BASE_URL}/movie/${movieId}?${API_KEY}`; 

            fetch(movieDetailsURL)
                .then(res => res.json())
                .then(movie => {
                    const { title, vote_average, overview, release_date, original_language } = movie;

                    // Traduce el resumen utilizando la API de Google Translate
                    translate(overview, {to: 'es'}) // Traduce al español, puedes cambiar al idioma que necesites
                        .then(translation => {
                            const modalContent = document.getElementById('modalContent');
                            modalContent.innerHTML = `
                                <h5>Título: ${title}</h5>
                                <p>Año de lanzamiento: ${release_date}</p>
                                <p>Idioma original: ${original_language}</p>
                                <p>Rating: ${vote_average}</p>
                                <p>Resumen: ${translation.text}</p>
                                <!-- Agrega más detalles de la película según sea necesario -->
                            `;
                            peliModal.show(); 
                        })
                        .catch(error => console.error('Error al traducir el resumen:', error));
                })
                .catch(error => console.error('Error al obtener los detalles de la película:', error));
        }
    });
});

function getPelis(url){
    fetch(url)
    .then(res => res.json())
    .then(data => {
        showPelis(data.results);
    })
    .catch(error => console.error('Error al obtener las películas:', error));
}

function showPelis(data){
    main.innerHTML = '';

    data.forEach(peli => {
        const { id, title, poster_path, vote_average } = peli;
        const peliCard = document.createElement('div');
        peliCard.classList.add('peli-card');
        peliCard.dataset.movieId = id; 
        peliCard.innerHTML = `
            <div class="card">
                <img src="${IMG_URL + poster_path}" alt="${title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title text-dark bg-light">${title}</h5>
                    <p class="card-text text-dark">Rating: <span class="${getColor(vote_average)}">${vote_average}</span></p>
                    
                </div>
            </div>
        `;

        main.appendChild(peliCard);
    });
}

function getColor(vote){
    if(vote >= 8){
        return 'green';
    } else if(vote >= 5){
        return 'orange';
    } else{
        return 'red';
    }
}

const translate = (text, { to }) => {
    return new Promise((resolve, reject) => {
        // Aquí deberías llamar a la API de Google Translate, 
        // como no puedo realizar llamadas a la API aquí, la función solo devuelve un texto de ejemplo
        const translatedText = `Translated text of "${text}" to ${to}`;
        resolve({ text: translatedText });
    });
};

// Llama a la función getPelis para cargar las películas cuando se carga la página
getPelis(API_URL);
