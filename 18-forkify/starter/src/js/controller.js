import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

const controlRecipes = async function () {
  const recipeID = window.location.hash.slice(1);

  if (!recipeID) return;

  try {
    recipeView.renderSpinner();

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
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (error) {
    console.error(error);
  }
};

const init = () => {
  recipeView.addRenderHandler(controlRecipes);
  searchView.addSearchHandler(controlSearchResults);
};

init();
