const fetchData = async searchTerm => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: { // this objects gets turned into a string and appendded into the axios url 
            apikey: 'ce38f3c0', // my api key i got unpon siging up to the website
            s: searchTerm //the search input user types in
        }
    });

    if (response.data.Error) {
        return [];
    }
    return response.data.Search; // getiing an array of different movies fetched
};

// the movie search
const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        <div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


//slecting the search input and applying it fetch data.
const onInput = async event => {
    const movies = await fetchData(event.target.value); //calling fecth data with the value of the input

    //hiding the dropdown if there is not search results
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //ternary expression to check if image is N/A or not

        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src="${imgSrc}"/>
            ${movie.Title}
        `;

        //handling when user click a movie the search bar inherits the name of movie cliked
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
        });

        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input', debounce(onInput, 500)); //applying debounce func with delay of 500ms

//handling the closing searched results after user clicks outside it.
document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active'); //removing is active to hide the dropdown
    }
})