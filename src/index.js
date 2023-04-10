import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = '35271544-92f681d037cad76a4cc4782d9';
let pageNumber = 1;
let totalHits = null;
let lightbox = null;

const fetchImages = async (searchQuery) => {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`);
    const images = response.data.hits;
    totalHits = response.data.totalHits;

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      if (pageNumber === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      const cards = images.reduce((markup, image) => {
        return `${markup}<a href="${image.largeImageURL}" class="photo-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${image.likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${image.views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${image.downloads}
            </p>
          </div>
        </a>`;
      }, '');

      gallery.insertAdjacentHTML('beforeend', cards);

      if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery a');
      } else {
        lightbox.refresh();
      }

      if (totalHits > pageNumber * 40) {
        loadMoreBtn.style.display = 'block';
        pageNumber++;
      } else {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  gallery.innerHTML = '';
  pageNumber = 1;

  const searchQuery = event.target.elements.searchQuery.value;
  fetchImages(searchQuery);

  loadMoreBtn.style.display = 'none';
};

if (searchForm) {
  searchForm.addEventListener('submit', handleFormSubmit);
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    const searchQuery = searchForm.elements.searchQuery.value;
    fetchImages(searchQuery);
  });
}
