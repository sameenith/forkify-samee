import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // here we use event deligation because there are going to be tow btn's
    // and we don't want to listen them individually so we add eventHandler
    // to common parent element
    this._parentElement.addEventListener('click', function (e) {
      // 1st we need to figure out which btn is hit based on the event
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // now we will creat a data attributes on each of the btn's
      // that will contain the page that we want to go to and using that
      // we can make connection between DOM and btn's
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    const curPage = this._data.page;

    // Page 1  and there are other pages
    if (curPage === 1 && numPages > 1)
      return `
      <button data-goto=${
        curPage + 1
      } class="btn--inline  pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;

    // Last page
    if (curPage === numPages && numPages > 1)
      return `
    <button  data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;

    // other page
    if (curPage > 1 && curPage < numPages)
      return `
      <button  data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button  data-goto=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
       <span>Page ${curPage + 1}</span>
       <svg class="search__icon">
         <use href="${icons}#icon-arrow-right"></use>
       </svg>
      </button>`;

    // Page 1  and there are No other pages
    return '';
  }
}

export default new PaginationView();
