import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _addRecipeButton = document.querySelector('.nav__btn--add-recipe');
  _closeModalButton = document.querySelector('.btn--close-modal');
  _uploadButton = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addToggleWindowHanlder();
  }

  #toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addToggleWindowHanlder() {
    this._addRecipeButton.addEventListener(
      'click',
      this.#toggleWindow.bind(this),
    );
    this._closeModalButton.addEventListener(
      'click',
      this.#toggleWindow.bind(this),
    );
    this._overlay.addEventListener('click', this.#toggleWindow.bind(this));
  }

  addUploadHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
