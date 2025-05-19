import icons from "url:../../img/icons.svg"; // Parcel 2

export default class View {
	_data;

	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	update(data) {
		// if (!data || (Array.isArray(data) && data.length === 0))
		// 	return this.renderError();
		this._data = data;
		const newMarkup = this._generateMarkup();
		const newDom = document.createRange().createContextualFragment(newMarkup);
		const newElements = Array.from(newDom.querySelectorAll("*"));
		const curElements = Array.from(this._parentElement.querySelectorAll("*"));

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i];
			// console.log(curEl, newEl.isEqualNode(curEl));

			// Update change texts
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ""
			) {
				curEl.textContent = newEl.textContent;
			}

			// Update change attributes
			if (!newEl.isEqualNode(curEl))
				Array.from(newEl.attributes).forEach((att) =>
					curEl.setAttribute(att.name, att.value)
				);
		});
	}

	_clear() {
		this._parentElement.innerHTML = "";
	}

	renderSpinner() {
		const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderMessage(message = this._message) {
		const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}
