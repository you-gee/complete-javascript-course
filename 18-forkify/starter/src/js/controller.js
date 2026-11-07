import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

const controlRecipes = async function () {
  const recipeID = window.location.hash.slice(1);

  if (!recipeID) return;

  try {
    recipeView.renderSpinner();

    await model.fetchRecipe(recipeID);

    recipeView.render(model.state.recipe);
    console.log(model.state);
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
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServingAmount) {
  model.updateServings(newServingAmount);
  recipeView.render(model.state.recipe);
};

const init = () => {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsHandler(controlServings);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPaginationHandler(controlPagination);
};

init();
