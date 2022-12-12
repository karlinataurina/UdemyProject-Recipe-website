import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function(event) {
        const btn = event.target.closest('.btn--inline');

        if(!btn) return; // if there is no button, just return

        const goToPage = +btn.dataset.goto; // with [+] converting the string to a number

        handler(goToPage);
      })
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const nrOfPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage);

        // We're on page 1 & there are other pages:
        if (curPage === 1 && nrOfPages > 1) {
            return `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
        }

        // We're on last page:
        if (curPage === nrOfPages && nrOfPages > 1) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
        }

        // We're on some other page between pages 1 & last page:
        if (curPage < nrOfPages) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
          `;
        }

        // We're on page 1 & there aren't any other pages:
        return '';
    }
}

export default new PaginationView();