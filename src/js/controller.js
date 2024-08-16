import recipeView from './views/recipeView.js';
import * as model from './model.js';
import { MODEL_CLOSE_SEC } from '../js/config.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

if (module.hot) {
  module.hot.accept();
}
//-----------koi bug aaye to debugger ka use karke
// pata kar sakte h kaha dikkat aa rahi h ---------------//
/////////////////////////////////////////////////////////////////////////
//---------------https://forkify-api.herokuapp.com/v2------------------//
/////////////////////////////////////////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // (0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // (1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // (2) loading recipe
    // here this is not returning any value here so we are not storing it in any variable
    await model.loadRecipe(id);

    // (3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

/*
// we use publisher-subscriber pattern (lec 289)

// everything related to view must be inside the view
//---------so here we don't want this code we want it in the view 
// but in this code we need controlRecipes function which is in this 
// controller and we don't want to put this function in view so we solve 
// this problem using publisher-subscriber pattern------------// 

//-------eventlisteners should be attached to the DOM elements 
// in the view but then event must be handel by controller functions  
// that live in controller moduel---------//

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
*/

/////////////////////////////////////////////////////////////////////////

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // (1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // (2) Load search results
    await model.loadSearchResults(query);

    // (3) render results
    resultsView.render(model.getSearchResultsPage());

    // (4) Render inital pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// to call this function we again use publisher and subscriber pattern
// controlSearchResults();

/////////////////////////////////////////////////////////////////////////

const controlPagination = function (goToPage) {
  // (1) render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // (2) Render NEW pagination button
  paginationView.render(model.state.search);
};

/////////////////////////////////////////////////////////////////////////

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  // here insted calling the renderMethod we will call updateMethod
  recipeView.update(model.state.recipe);
};

/////////////////////////////////////////////////////////////////////////

const controlAddBookmark = function () {
  // (1) ADD / REMOVE  Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }
  // console.log(model.state.recipe);

  // (2) Update recipe view
  recipeView.update(model.state.recipe);

  // (3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/////////////////////////////////////////////////////////////////////////

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/////////////////////////////////////////////////////////////////////////

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // pushState(state,title,url) allow us changeing the url with out
    //  reloading and it takes 3 arguments

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // we are not using update here because we really want to insert
    // new element in there and for that we always use render method

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥${err.message}`);
    addRecipeView.renderError(err.message);
  }
};

/////////////////////////////////////////////////////////////////////////
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  /*
     controlServings();
  // we are trying to control the servings by simply after registring
  //  these handler function here but that time no recipies is arrived
  //  from the API so therefore state.recipe is not defined yut and then
  //  we are trying to read ingridients on state.recipie that doesn't
  //  exist and this known as pitch falls of working with javaScript
  */
};
init();
