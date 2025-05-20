import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, API_KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helper.js";
import { AJAX } from "./helper.js";

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

const createRecipeObject = function (data) {
	const { recipe } = data.data;
	return (state.recipe = {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }),
	});
};

export const loadRecipe = async function (id) {
	try {
		const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
		state.recipe = createRecipeObject(data);

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
		const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
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

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
			.map((ing) => {
				// const ingArr = ing[1].replaceAll(" ", "").split(",");
				const ingArr = ing[1].split(",").map((el) => el.trim());
				if (ingArr.length !== 3)
					throw new Error(
						"Wrong ingredient format! Please use the correct format!!"
					);
				const [quantity, unit, description] = ingArr;
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
		console.log(recipe);
		const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
};
