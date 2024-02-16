//TMBD

const API_KEY = 'api_key=f983f1a73e02ec0fd3c6c40e9180ffa5';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('main');

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

    data.forEach(peli => {
        const { id, title, poster_path, vote_average, overview } = peli;
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
                        <!-- Agrega más detalles de la película según sea necesario -->
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

// Función para traducir el overview al idioma deseado
function translateOverview(overview, targetLanguage) {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://google-translator9.p.rapidapi.com/v2/translate',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '462a288322msh405fc9ea2d873dfp11d878jsn05ac89c7c840',
            'X-RapidAPI-Host': 'google-translator9.p.rapidapi.com'
        },
        processData: false,
        data: JSON.stringify({
            q: overview,
            target: targetLanguage
        })
    };

    // Realiza la solicitud para traducir el overview al idioma deseado
    $.ajax(settings)
        .done(function(response) {
            const translatedOverview = response.data.translation;
            // Actualiza el contenido del modal con el overview traducido
            document.getElementById('modalContent').innerHTML += `
                <p>Resumen traducido: ${translatedOverview}</p>
            `;
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error al traducir el overview:', errorThrown);
        });
}
