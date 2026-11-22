import View from './view';
import previewView from './previewView';

/**
 * Saved-bookmarks list view.
 *
 * @extends View
 */
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Go get one from the recipes.`;
  _message = '';

  /**
   * Registers the bookmark initialization handler.
   *
   * @param {Function} handler Callback invoked after the window loads.
   * @returns {void}
   */
  addBookmarksHandler(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
