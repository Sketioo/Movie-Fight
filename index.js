const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}">
      <h2>${movie.Title}</h2>
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "d9952492",
        s: searchTerm,
      },
    });
  
    if (response.data.Error) {
      return [];
    }
  
    return response.data.Search;
  }
}
createAutocomplete({
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
  ...autoCompleteConfig
})
createAutocomplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
  ...autoCompleteConfig
})

let rightMovie;
let leftMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "d9952492",
      i: movie.imdbID,
    },
  });

  if(side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if(leftMovie && rightMovie) {
    setTimeout(() =>{
      runComparison();
    }, 500)
  }

  movie = response.data;
  summaryElement.innerHTML = movieTemplate(movie);
}

const runComparison = () => {
  const rightSideStats = document.querySelectorAll('#right-summary .notification');
  const leftSideStats = document.querySelectorAll('#left-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    leftStatValue = leftStat.dataset.value;
    rightStatValue = rightStat.dataset.value;

    if(rightStatValue > leftStatValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning')
    }
  })
}

const movieTemplate = (movieDetail) => {
  const BOincome = movieDetail.BoxOffice === undefined ? '$0' : movieDetail.BoxOffice;

  const dollars = parseInt(BOincome.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVote = parseFloat(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if(isNaN(value)) {
      return prev;
    } else {
      return value + prev;
    }
  }, 0)

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h2>${movieDetail.Title}</h2>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value="${awards}" class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
      <p class="title">${BOincome}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Meta score</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVote}" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}