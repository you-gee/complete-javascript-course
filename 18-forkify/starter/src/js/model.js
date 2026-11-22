import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

/**
 * Data model and application state for the Forkify application.
 *
 * @module model
 */

/**
 * Represents an ingredient in a recipe.
 *
 * @typedef {Object} Ingredient
 * @property {number|null} quantity Ingredient quantity, or null when unspecified.
 * @property {string} unit Measurement unit.
 * @property {string} description Ingredient description.
 */

/**
 * Represents a normalized recipe.
 *
 * @typedef {Object} Recipe
 * @property {string} id Recipe identifier.
 * @property {string} title Recipe title.
 * @property {string} publisher Publisher name.
 * @property {string} sourceUrl Original recipe URL.
 * @property {string} image Recipe image URL.
 * @property {number} servings Number of servings.
 * @property {number} cookingTime Cooking time in minutes.
 * @property {Ingredient[]} ingredients Recipe ingredients.
 * @property {string} [key] API key associated with a user-created recipe.
 * @property {boolean} [bookmarked] Whether the recipe is bookmarked.
 */

/**
 * Shared application state.
 *
 * @type {{recipe: Recipe|Object, search: {query: string, results: Recipe[], page: number, resultsPerPage: number}, bookmarks: Recipe[]}}
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Normalizes an API recipe response into the application recipe shape.
 *
 * @param {Object} data API response containing a `data.recipe` object.
 * @returns {Recipe} Normalized recipe.
 * @private
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // smart-ass tricks can trip you up someday,  "...(recipe.key != null ? { key: recipe.key } : {})" is more readable
  };
};

/**
 * Loads a recipe and stores it in application state.
 *
 * @param {string} recipeID Recipe identifier.
 * @returns {Promise<void>} Resolves after the recipe is loaded.
 * @throws {Error} If the recipe request fails.
 */
export const fetchRecipe = async function (recipeID) {
  try {
    const data = await AJAX(`${API_URL}/${recipeID}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === recipeID)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Searches for recipes and stores the normalized results.
 *
 * @param {string} query Search query.
 * @returns {Promise<void>} Resolves after search results are loaded.
 * @throws {Error} If the search request fails.
 */
export const getSearchResults = async function (query) {
  state.search.query = query;

  try {
    const response = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = response.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

/**
 * Returns the search results for one page.
 *
 * @param {number} [page=state.search.page] Page number to retrieve.
 * @returns {Recipe[]} Recipes belonging to the requested page.
 */
export const getCurrentPageSearchResults = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

/**
 * Recalculates ingredient quantities for a new serving count.
 *
 * @param {number} newServingAmount Desired number of servings.
 * @returns {void}
 */
export const updateServings = function (newServingAmount) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServingAmount;
  });

  state.recipe.servings = newServingAmount;
};

/**
 * Persists the current bookmarks in local storage.
 *
 * @returns {void}
 * @private
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds a recipe to bookmarks and persists the bookmark list.
 *
 * @param {Recipe} recipe Recipe to bookmark.
 * @returns {void}
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
};

/**
 * Removes a bookmark by recipe identifier and persists the updated list.
 *
 * @param {string} id Recipe identifier to remove.
 * @returns {void}
 */
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

/**
 * Parses and uploads a recipe submitted through the add-recipe form.
 *
 * @param {Object<string, string>} newRecipe Raw form values keyed by field name.
 * @returns {Promise<void>} Resolves after the uploaded recipe is stored and bookmarked.
 * @throws {Error} If an ingredient format or API request is invalid.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => {
        return entry[0].startsWith('ingredient') && entry[1] !== '';
      })
      .map(ingredient => {
        const ingredientArray = ingredient[1].split(',').map(el => el.trim());
        if (ingredientArray.length !== 3) {
          throw new Error('Please use correct ingredient format.');
        }
        const [quantity, unit, description] = ingredientArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };

    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(response);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

(function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
})();
