import View from './view';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;
  _message = '';

  _generateMarkup() {
    return this._data.map(li => this.#generateMarkupSearchResult(li)).join('');
  }

  #generateMarkupSearchResult(li) {
    return `
        <li class="preview">
            <a class="preview__link" href="#${li.id}">
            <figure class="preview__fig">
                <img src="${li.image}" alt="${li.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${li.title}</h4>
                <p class="preview__publisher">${li.publisher}</p>
            </div>
            </a>
        </li>
    `;
  }
}

export default new ResultsView();
