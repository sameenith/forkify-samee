import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const creatRecipeObject = function (data) {
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

    // agar key exixt karegi kisi ki to usko key:recipe.key me sotre
    //  kara denge aur nhi karegi to && short circuit kar dega
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    state.recipe = creatRecipeObject(data);
    console.log(state.recipe);

    //------------------------for bookmark-----------------------------//
    // here we check if their is already a recipe with the same id in
    //  the bookmarked state if it is then we will mark the current
    //  recipe that we just loaded from the API as bookmarked set to true
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err}💥💥💥💥}`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&?key=${KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    console.log(state.search.results);
  } catch (err) {
    console.error(`${err}💥💥💥💥`);
    throw err;
  }
};

// so at this point we have already fatched the data so we don't need
// to write it as async function

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.map(ing => {
    // newQuantity= (oldQuantity *newServings)/oldServings
    return (ing.quantity =
      (ing.quantity * newServings) / state.recipe.servings);
  });
  // update the servings to newServing
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // beside this we also want to bookmark the current recipe also or
  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // here bookmarked is a new property

  persistBookmarks();
};

// this is common pattern in programming that when we add something
// we get the entier data but when we have to remove/delete
//  something we only get the id

export const deleteBookMark = function (id) {
  //Delete bookMarked
  const index = state.bookmarks.findIndex(el => (el.id = id));
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Storing data in local storage is all about data and that will have
// to implimented in model
// whenever we add  the data or delete the data we need to persist that
// data so let add a funtion that we can call in these two
// function(add/delete boomark) now data is stored in local storage
// ab hame reload karne pr vo data vapas chahiye local storage se to
// uske liye ham initialization function ka use kar rahe h

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
console.log(state.bookmarks);

//-----------------getting error in rendring recipe---------------------//
// View.js me newElement and curElement array ki length alag alag h aur
// ham undono ko compair kar rahe h because goal of that method is not to
// add some new element but only to replace some text in elemnts
// that already exist to jo hamara bookmark h jo abhi tak empty h lekin
// jo update method is trying to do is to insert the data in their
//  and that should not happend
// to prevent this 1st thing we need to do is to "render the bookmarks"
// that should happen when we reload the page
// and to do this add a handler to "bookmarksView.js"

// function for debugging
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// it will going to make request to API so this will be an async function
export const uploadRecipe = async function (newRecipe) {
  try {
    // formating raw data into the formate of API
    // Object.Entries is opposite of Object.fromEntries
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity, unit, description };
      });

    // consverting data object to the formate of API
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = creatRecipeObject(data);
    // now sending this data to API using sendJSON method created in helper.js

    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
