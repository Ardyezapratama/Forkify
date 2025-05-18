import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/actual";
import "regenerator-runtime/runtime";

if (module.hot) {
	module.hot.accept();
}

const controlRecipe = async function () {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;

		recipeView.renderSpinner();

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
		resultsView.render(model.state.search.results);
	} catch (err) {
		recipeView.renderError();
	}
};

const init = function () {
	recipeView.addHandlerRender(controlRecipe);
	searchView.addHandlerSearch(controlSearchResults);
};

init();
