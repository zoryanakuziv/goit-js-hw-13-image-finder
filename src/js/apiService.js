export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImagesByKeyWord() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '21953408-9a5de6ff69ebf5e97d9ab4bfd';
    return fetch(
      `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`,
    )
      .then(response => response.json())
      .then(({ hits }) => {
        this.page += 1;
        return hits;
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
