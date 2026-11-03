import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const pagesAmount = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    const currentPage = this._data.page;

    // Less results than max amount on page
    if (pagesAmount <= 1 || currentPage > pagesAmount) {
      return '';
    }

    // First page with 1+ result pages
    if (currentPage === 1 && pagesAmount > currentPage) {
      return this._generatePageButton(currentPage + 1, 'next');
    }

    // Last page with only '< Page #'
    if (currentPage === pagesAmount) {
      return this._generatePageButton(currentPage - 1, 'prev');
    }

    // Other pages
    if (currentPage < pagesAmount) {
      return (
        this._generatePageButton(currentPage - 1, 'prev') +
        this._generatePageButton(currentPage + 1, 'next')
      );
    }
  }

  _generatePageButton(page, direction) {
    const icon = direction === 'prev' ? 'arrow-left' : 'arrow-right';

    return `
    <button class="btn--inline pagination__btn--${direction}" data-goto="${page}">
      ${direction === 'prev' ? `<svg class="search__icon"><use href="${icons}#icon-${icon}"></use></svg>` : ''}
      <span>Page ${page}</span>
      ${direction === 'next' ? `<svg class="search__icon"><use href="${icons}#icon-${icon}"></use></svg>` : ''}
    </button>
  `;
  }

  addPaginationHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
