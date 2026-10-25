class SearchView {
  #parentElement = document.querySelector('.search');

  #clearSearchField() {
    this.#parentElement.innerHTML = '';
  }

  getQuery() {
    const result = this.#parentElement.querySelector('.search__field').value;
    this.#clearSearchField();
    return result;
  }

  addSearchHandler(handlerFunction) {
    this.#parentElement.addEventListener('submit', handlerFunction);
  }
}

export default new SearchView();
