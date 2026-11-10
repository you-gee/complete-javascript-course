import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

const controlRecipes = async function () {
  try {
    const recipeID = window.location.hash.slice(1);

    if (!recipeID) return;

    recipeView.renderSpinner();

    resultsView.update(model.getCurrentPageSearchResults());

    await model.fetchRecipe(recipeID);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();

    if (!query) {
      return;
    }

    resultsView.renderSpinner();

    await model.getSearchResults(query);
    resultsView.render(model.getCurrentPageSearchResults());
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getCurrentPageSearchResults(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServingAmount) {
  model.updateServings(newServingAmount);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  console.log(model.state.recipe);
};

const init = () => {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPaginationHandler(controlPagination);
};

init();
