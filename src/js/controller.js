// Forkify API v2 Documentation: https://forkify-api.herokuapp.com/v2
import * as model from './model';
import * as TIMER from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';
import _msg from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// Making first API call:
const controlRecipes = async function () {
  try {
    // getting the ID & hash of recipe:
    const id = window.location.hash.slice(1);

    // guard clause:
    if (!id) return;

    // loading spinner:
    recipeView.renderSpinner();

    // Update "resultsView" to mark selected search result as active:
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmarksView:
    bookmarksView.update(model.state.bookmarks);

    // Loading the recipe:
    await model.loadRecipe(id);

    // Rendering the recipe:
    recipeView.render(model.state.recipe);

  } catch (error) {
    recipeView.renderError();
  }
};
// Making first API call end

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get search query:
    const query = searchView.getQuery();

    // there might be no query, so if there is no query, return immediately:
    if (!query) return;

    // 2) Loading recipe / Load search results:
    await model.loadSearchResults(query);

    // 3) Render results:
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons:
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error)
  }
};

// Will be executed when a click on a button happens:
const controlPagination = function(goToPage) {
  // 1) Render new results:
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons:
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Update recipe servings [in state]:
  model.updateServings(newServings);

  // Update the recipe view:
  recipeView.update(model.state.recipe);
};

// controller for adding a new bookmark:
const controlAddBookmark = function() {
  // we want to add a bookmark when recipe is not yet bookmarked:
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // we want to remove a bookmark when recipe is bookmarked:
  else model.deleteBookmark(model.state.recipe.id);

  // updates the recipe view:
  recipeView.update(model.state.recipe);

  // Render the bookmarks:
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {

  try {
    // Show spinner:
    addRecipeView.renderSpinner();

    // Upload the new recipe data:
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the new recipe view:
    recipeView.render(model.state.recipe);

    // Display success message when adding new recipe:
    addRecipeView.renderSuccess();

    // Render bookmarks view after adding new recipe:
    bookmarksView.render(model.state.bookmarks);
    
    // Change ID in the URL for the new recipe:
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Closing the recipe adding form window:
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, TIMER * 1000);

  } catch(error) {
    console.error('Oops!', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init(); // <= with this we just implemented the Publisher-Subscriber pattern
