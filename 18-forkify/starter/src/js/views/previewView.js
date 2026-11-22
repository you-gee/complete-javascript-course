import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Compact recipe-preview view used in search and bookmark lists.
 *
 * @extends View
 */
class PreviewView extends View {
  _parentElement = document.querySelector('.upload');
  _errorMessage = 'previeView error message';

  _generateMarkup() {
    const recipeID = window.location.hash.slice(1);

    return `
        <li class="preview">
            <a class="preview__link ${this._data.id === recipeID ? 'preview__link--active' : ''}" href="#${this._data.id}">
            <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
                    <svg>
                    <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
            </div>
            </a>
        </li>
    `;
  }
}

export default new PreviewView();
