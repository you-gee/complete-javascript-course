import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

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

export const getCurrentPageSearchResults = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServingAmount) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServingAmount;
  });

  state.recipe.servings = newServingAmount;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

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
