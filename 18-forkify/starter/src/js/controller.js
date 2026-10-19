import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';

const controlRecipes = async function () {
  const recipeID = window.location.hash.slice(1);

  if (!recipeID) return;

  try {
    recipeView.renderSpinner();

    await model.fetchRecipe(recipeID);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.warn(err);
  }
};

const init = () => {
  recipeView.addRenderHandler(controlRecipes);
};

init();
