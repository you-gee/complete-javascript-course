import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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

const hashEvents = ['hashchange', 'load'];
hashEvents.forEach(event => window.addEventListener(event, controlRecipes));
