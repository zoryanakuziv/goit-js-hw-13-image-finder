import * as basicLightbox from 'basiclightbox';
import './sass/main.scss';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { defaults, error } from '@pnotify/core';
defaults.width = '450px';
defaults.delay = 3000;
export default function onErrorMessage(text) {
  error(text);
}
import photoCardsMurkUp from './templates/photo-card.hbs';
import PhotoApiService from './js/apiService.js';
import LoadMoreBtn from './js/loadMoreBtn';

import searchFormTpl from './templates/search-form.hbs';
import galleryTpl from './templates/gallery.hbs';
import buttonTpl from './templates/button.hbs';

document.body.insertAdjacentHTML('afterbegin', buttonTpl());
document.body.insertAdjacentHTML('afterbegin', galleryTpl());
document.body.insertAdjacentHTML('afterbegin', searchFormTpl());

const refs = {
  searchForm: document.querySelector('#search-form'),
  photoGallary: document.querySelector('.gallery'),
  scrollElement: document.querySelector('.scroll-element'),
};
const photoApiService = new PhotoApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);
refs.photoGallary.addEventListener('click', onImageEnlarge);

function onSearch(event) {
  event.preventDefault();
  onClearForm();
  photoApiService.query = event.currentTarget.elements.query.value.toLowerCase();
  loadMoreBtn.show();
  photoApiService.resetPage();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();
  photoApiService.fetchImagesByKeyWord().then(hits => {
    if (hits.length === 0) {
      onErrorMessage('No results founded. Please, try again! ');
      onClearForm();
      loadMoreBtn.hide();
      photoApiService.resetPage();
      return;
    }
    renderPhotoCard(hits);
    onScroll();
    loadMoreBtn.enable();
  });
}

function onClearForm(error) {
  refs.photoGallary.innerHTML = '';
}

function renderPhotoCard(hits) {
  refs.photoGallary.insertAdjacentHTML('beforeend', photoCardsMurkUp(hits));
  if (hits.length < 12) {
    document.body.insertAdjacentText('beforeend', 'No more images found in this category...');
    loadMoreBtn.hide();
  }
}

function onImageEnlarge(event) {
  const targetImg = event.target;
  const currentImage = targetImg.dataset.source;
  // console.log(currentImage);
  const instance = basicLightbox.create(`
    <img src="${currentImage}" alt="${targetImg.alt}" >
`);
  instance.show(currentImage);
}
function onScroll() {
  refs.scrollElement.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}
