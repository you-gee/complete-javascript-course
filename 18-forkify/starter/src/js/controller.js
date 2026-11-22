import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_TIME_SEC } from './config.js';

/**
 * Application controller that connects views with the data model.
 *
 * @module controller
 */

/**
 * Loads and renders the recipe identified in the URL hash.
 *
 * @returns {Promise<void>}
 */
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
    recipeView.renderError(error.message);
  }
};

/**
 * Executes the current search and renders the first page of results.
 *
 * @returns {Promise<void>}
 */
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

/**
 * Renders search results for a requested page.
 *
 * @param {number} goToPage Page number to display.
 * @returns {void}
 */
const controlPagination = function (goToPage) {
  resultsView.render(model.getCurrentPageSearchResults(goToPage));
  paginationView.render(model.state.search);
};

/**
 * Updates ingredient quantities for a new serving count.
 *
 * @param {number} newServingAmount Desired number of servings.
 * @returns {void}
 */
const controlServings = function (newServingAmount) {
  model.updateServings(newServingAmount);
  recipeView.update(model.state.recipe);
};

/**
 * Toggles the current recipe bookmark and refreshes bookmark views.
 *
 * @returns {void}
 */
const controlToggleBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Renders the list of saved bookmarks.
 *
 * @returns {void}
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Uploads a submitted recipe and updates the application views.
 *
 * @param {Object<string, string>} newRecipe Submitted form values.
 * @returns {Promise<void>}
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_TIME_SEC * 1000);
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    console.error('CUSTOM ERROR: ', error);
    addRecipeView.renderError(error.message);
  }
};

/**
 * Registers all application event handlers.
 *
 * @returns {void}
 */
const init = () => {
  bookmarksView.addBookmarksHandler(controlBookmarks);
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlToggleBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPaginationHandler(controlPagination);
  addRecipeView.addUploadHandler(controlAddRecipe);
  console.log('Welcome to the app :)');
};

init();
