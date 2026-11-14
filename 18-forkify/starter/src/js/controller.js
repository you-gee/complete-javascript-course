import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

const controlRecipes = async function () {
  try {
    const recipeID = window.location.hash.slice(1);

    if (!recipeID) return;

    recipeView.renderSpinner();
    resultsView.update(model.getCurrentPageSearchResults());
    bookmarksView.update(model.state.bookmarks);
    await model.fetchRecipe(recipeID);
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
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

const controlToggleBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = () => {
  bookmarksView.addBookmarksHandler(controlBookmarks);
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlToggleBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPaginationHandler(controlPagination);
};

init();
