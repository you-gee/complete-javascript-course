import View from './view';

/**
 * Add-recipe modal view.
 *
 * @extends View
 */
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _addRecipeButton = document.querySelector('.nav__btn--add-recipe');
  _closeModalButton = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addToggleWindowHanlder();
  }

  /**
   * Toggles the modal and overlay visibility.
   *
   * @returns {void}
   */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addToggleWindowHanlder() {
    this._addRecipeButton.addEventListener(
      'click',
      this.toggleWindow.bind(this),
    );
    this._closeModalButton.addEventListener(
      'click',
      this.toggleWindow.bind(this),
    );
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Registers the recipe form submit handler.
   *
   * @param {Function} handler Callback receiving the normalized form data.
   * @returns {void}
   */
  addUploadHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
}

export default new AddRecipeView();
