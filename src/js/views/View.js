import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   * Renders the received object to the DOM
   * @param {Object | Object[]} data ... The data to be rendered (e.g. a recipe)
   * @param {boolean} [render=true] ... If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} ... A markup string is returned if render=false
   * @this {Object} View instance
   * @author Karlīna Tauriņa
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if(!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Updating DOM elements: changing/updating only text or attributes, when buttons are clicked.
  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];

      // Updates the changed text:
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // Updates the changed attributes:
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attribute => curEl.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // External function for the spinner:
  renderSpinner() {
    const markup = `
      <div class="spinner>
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // Error handling:
  renderError(message = this._errorMsg) {
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
    </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Success message:
  renderSuccess(message = this._msg) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
    </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}