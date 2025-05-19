import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helper.js";

export const state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
};

export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);
		const { recipe } = data.data;
		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};
		if (state.bookmarks.some((bookmark) => bookmark.id === id))
			state.recipe.bookmarked = true;
		else state.recipe.bookmarked = false;
	} catch (err) {
		// Handel Errors
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;
		const data = await getJSON(`${API_URL}?search=${query}`);

		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
			};
		});
		state.search.page = 1;
	} catch (err) {
		// Handle Errors
		throw err;
	}
};

export const getSearchResultsPerPage = function (page = state.search.page) {
	state.search.page = page;
	return state.search.results.slice(
		(page - 1) * state.search.resultsPerPage,
		page * state.search.resultsPerPage
	);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		// newQt = oldQt * newServings / oldServings
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});

	state.recipe.servings = newServings;
};

const presistBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	// Add bookmark
	state.bookmarks.push(recipe);

	// Mark current recipe as bookmark
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

	presistBookmarks();
};

export const deleteBookmark = function (id) {
	// Delete bookmark
	const idx = state.bookmarks.findIndex((el) => el.id === id);
	state.bookmarks.splice(idx, 1);

	// unmark current recipe as bookmark
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	presistBookmarks();
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// const clearBookmark = function () {
// 	localStorage.clear("bookmarks");
// };

// clearBookmark();
