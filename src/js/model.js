import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PAR_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PAR_PAGE,
    },
    bookmarks: [],
}; // state contains all data that we need in order to build our app

const createRecipeObject = function(data) {
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
        ...(recipe.key && { key: recipe.key }),
    };
};

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}`);
        
        state.recipe = createRecipeObject(data);

        /* if-else for bookmarking recipes. if recipe is bookmarked, set to true, otherwise set to false.
        so if recipe = bookmarked, the button changes colors: */
        if (state.bookmarks.some(
            bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;

        console.log(state.recipe);
    } catch (error) {
        // temporary error handling:
        console.error(`${error} :((((((`);
        throw error;
    }
};

/* IMPLEMENTATION OF THE SEARCH FUNCTIONALITY */
export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data);

        state.search.results = data.data.recipes.map(recipee => {
            return {
                id: recipee.id,
                title: recipee.title,
                publisher: recipee.publisher,
                image: recipee.image_url,
                ...(recipee.key && { key: recipee.key }),
            };
        }); /* with this code block we got an array of objects, then created a new
        array, which then contains the new objects with the changed property names. */

        state.search.page = 1; // this ensures we're on results page 1 again, when searching for different recipes
    } catch (error) {
        console.error(`${error} :(`);
        throw error;
    }
};

// Pagination:
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; // 0;
    const end = page * state.search.resultsPerPage; // 9;

    return state.search.results.slice(start, end);
};

// Updating serving size:
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(curIngredient => {
        curIngredient.quantity = (curIngredient.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

// Adding a bookmark:
export const addBookmark = function (recipe) {
    // Add bookmark:
    state.bookmarks.push(recipe);

    // Mark current recipe as a bookmark:
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    // Making the bookmark stay bookmarked even after a page reload:
    persistBookmarks();
};

// Removing the bookmark:
export const deleteBookmark = function (id) {
    // Delete bookmark:
    const index = state.bookmarks.findIndex(element => element.id === id);
    state.bookmarks.splice(index, 1);

    // Mark the current recipe as not bookmarked anymore:
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    // Making the bookmark stay bookmarked even after a page reload:
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// function for debugging: will be off by default
const clearBookmarks = function () {
    localStorage.clear("bookmarks");
};
//clearBookmarks();

// Uploading recipe:
export const uploadRecipe = async function (newRecipe) {
    try {
    const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient')
    && entry[1] !== '')
    .map(ingredient => {
        const ingredientsArray = ingredient[1].split(',').map(element => element.trim());

        if(ingredientsArray.length !== 3) throw new Error('Wrong ingredient format, please use the correct format!');
        
        const [quantity, unit, description] = ingredientsArray;

        return { quantity: quantity ? +quantity : null, unit, description };
    });

    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); // sends recipe back to us
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    } catch (error) {
        throw error;
    }
};