import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    console.log(this._data);
    const pagesAmount = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    console.log(pagesAmount);

    
  }

  generatePreviousPageButton() {
    return `
        <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
        </button>;
    `;
  }

  generateNextPageButton() {
    return `
        <buttontton class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </buttontton>
    `;
  }

  addPaginationHandler() {}
}

export default new PaginationView();
