const API_KEY = 'api_key=f983f1a73e02ec0fd3c6c40e9180ffa5';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
let topCounter = 0;

getPelis(API_URL);

function getPelis(url){
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data.results)
        showPelis(data.results);
    })
}

function showPelis(data){
    main.innerHTML = '';

    data.forEach((peli, index) => {
        const { id, title, poster_path, vote_average, overview } = peli;
        const peliCard = document.createElement('div');
        peliCard.classList.add('peli-card');
        peliCard.dataset.movieId = id;

        topCounter++; // Incrementa el contador para cada película

        peliCard.innerHTML = `
            <div class="card">
                <img src="${IMG_URL + poster_path}" alt="${title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title text-dark bg-light">${title}</h5>
                    <p class="card-text text-dark">Rating: <span class="${getColor(vote_average)}">${vote_average}</span></p>
                </div>
            </div>
        `;
        
        // Agrega el badge al card
        const badge = document.createElement('span');
        badge.classList.add('badge', 'badge-primary', 'position-absolute', 'top-0', 'end-0', 'mt-2', 'me-2');
        badge.innerText = `Top ${topCounter}`;
        peliCard.querySelector('.card').appendChild(badge);

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

                    const modalContent = document.getElementById('modalContent');
                    modalContent.innerHTML = `
                        <h5>Título: ${title}</h5>
                        <p>Año de lanzamiento: ${release_date}</p>
                        <p>Idioma original: ${original_language}</p>
                        <p>Rating: ${vote_average}</p>
                        <p>Resumen: ${overview}</p>
                    `;

                    peliModal.show(); 

                    // Traduce el resumen al idioma deseado
                    translateOverview(overview, 'es'); // Cambia 'es' al idioma deseado
                })
                .catch(error => console.error('Error al obtener los detalles de la película:', error));
        }
    });

    // Evento de clic para el enlace "Peliculas"
    const peliculasLink = document.getElementById('peliculasLink');
    peliculasLink.addEventListener('click', scrollToCards);
});

// Función para desplazar suavemente hacia las cards
function scrollToCards(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    const cardsSection = document.getElementById('main');
    cardsSection.scrollIntoView({ behavior: 'smooth' });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchTerm = search.value;
    if(searchTerm) {
        getPelis(SEARCH_URL+ '&query='+ searchTerm)
    }else{
        getPelis(API_URL);
    }
});