import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--inline");
			if (!btn) return;
			const goToPage = +btn.dataset.goto;
			handler(goToPage);
		});
	}

	_generateMarkup() {
		const currentPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		// Page 1, and there are other pages
		if (currentPage === 1 && numPages > 1) {
			return this._nextBtnMarkup(currentPage);
		}
		// Last page
		if (currentPage === numPages && numPages > 1) {
			return this._prevBtnMarkup(currentPage);
		}
		// Oter pages
		if (currentPage < numPages) {
			return `${this._nextBtnMarkup(currentPage)}
			${this._prevBtnMarkup(currentPage)}`;
		}
		// Page 1, and there are no other pages
		return "";
	}

	_nextBtnMarkup(currentPage) {
		return `
            <button data-goto="${
							currentPage + 1
						}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
	}

	_prevBtnMarkup(currentPage) {
		return `
            <button data-goto="${
							currentPage - 1
						}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
        `;
	}
}

export default new PaginationView();
