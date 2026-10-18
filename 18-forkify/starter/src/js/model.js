import async from 'regenerator-runtime';

export const state = {
  recipe: {},
};

export const fetchRecipe = async function (recipeID) {
  try {
    const res = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes/${recipeID}`,
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }

    console.log(res, data);

    const recipe = data.data.recipe;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      imageUrl: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (error) {
    alert(error);
  }
};
