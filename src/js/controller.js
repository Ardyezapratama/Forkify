import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/actual";
import "regenerator-runtime/runtime";

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

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
		alert(err);
	}
};

controlRecipe();

["hashchange", "load"].forEach((ev) =>
	window.addEventListener(ev, controlRecipe)
);
