import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";

import "core-js/actual";
import "regenerator-runtime/runtime";

const controlRecipe = async function () {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;

		recipeView.renderSpinner();

		// 0. Update result view to mark selected search results
		resultsView.update(model.getSearchResultsPerPage());
		bookmarksView.update(model.state.bookmarks);

		// 1. Loading recipe
		await model.loadRecipe(id);

		// 2. Rendering recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();
		// 1. Get search query
		const query = searchView.getQuery();
		if (!query) return;

		// 2. Load search results
		await model.loadSearchResults(query);

		// 3. Render results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPerPage());

		// 4. Render the initial pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlPagination = function (goToPage) {
	// 1. Render New results
	// resultsView.render(model.state.search.results);
	resultsView.render(model.getSearchResultsPerPage(goToPage));

	// 2. Render the new pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);
	// Update the recipe view
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// Add or remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// Update recipe view
	recipeView.update(model.state.recipe);

	// Render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const init = function () {
	recipeView.addHandlerRender(controlRecipe);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};

init();
