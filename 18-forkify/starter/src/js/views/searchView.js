import View from './view';
/**
 * Search form view.
 *
 * @extends View
 */
class SearchView extends View {
  _parentElement = document.querySelector('.search');

  /**
   * Reads the search field, clears it, and returns its value.
   *
   * @returns {string} Search query.
   */
  getQuery() {
    const result = this._parentElement.querySelector('.search__field').value;
    this._parentElement.querySelector('.search__field').value = '';
    return result;
  }

  /**
   * Registers the search form submit handler.
   *
   * @param {Function} handlerFunction Callback invoked after form submission.
   * @returns {void}
   */
  addSearchHandler(handlerFunction) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handlerFunction();
    });
  }
}

export default new SearchView();
