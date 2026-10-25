import View from './view';
class SearchView extends View {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const result = this._parentElement.querySelector('.search__field').value;
    this._parentElement.querySelector('.search__field').value = '';
    console.log(result);
    return result;
  }

  addSearchHandler(handlerFunction) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handlerFunction();
    });
  }
}

export default new SearchView();
