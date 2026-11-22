import icons from 'url:../../img/icons.svg';

/**
 * Base view class providing shared rendering and DOM update behavior.
 *
 * Subclasses define `_parentElement`, `_generateMarkup`, and optional
 * `_errorMessage` and `_message` properties.
 */
export default class View {
  _data;

  /** Clears the view's parent element. @returns {void} @private */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Renders data into the parent element or returns generated markup.
   *
   * @param {Object|Object[]} data Data used to generate markup.
   * @param {boolean} [render=true] Whether to update the DOM immediately.
   * @returns {string|void} Markup when `render` is false.
   */
  render(data, render = true) {
    if (!data || data.length === 0) {
      return this.renderError();
    }
    this._data = data;

    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Updates existing DOM nodes instead of replacing the entire parent element.
   *
   * @param {Object|Object[]} data Updated view data.
   * @returns {void}
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*'),
    );

    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElement.textContent = newElement.textContent;
      }

      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute =>
          currentElement.setAttribute(attribute.name, attribute.value),
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Renders an error message in the view.
   *
   * @param {string} [message=this._errorMessage] Error text to display.
   * @returns {void}
   */
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders a success or informational message.
   *
   * @param {string} [message=this._message] Message text to display.
   * @returns {void}
   */
  renderMessage(message = this._message) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /** Renders a loading spinner. @returns {void} */
  renderSpinner() {
    this._clear();
    const html = `
        <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
