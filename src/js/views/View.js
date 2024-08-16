import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *
   * @param {object | object[]} data the data to be rendered  (e.g. recipe)
   * @param {boolean} [render=true] if false creat markup string instead of rendring to DOM
   * @returns {undefined | string} a markup string is returns if render=false
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // updateMethod will also need the same data as renderMethod but
  //  the differance is it only updates the text and attributes in
  // the DOM without having rerander the entier view

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    // basically here we will compair the old markup and new markup
    // but compairing two string is very difficult to have
    // the DOM element currently we have on the page
    // --but their is a trick --> convert the markup string to DOM
    // object in the memory and then we can compair it with actual DOM

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // consverting new string to real DOM object
    // console.log(newDOM);

    // selecting the elements
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // these will creat a node list that's why we use
    //  Array.from() to convert then into an array
    // console.log(newElements);
    // console.log(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // the elements still needs to be different but now we want element
      //  that are only text newElement.firstChildNode

      //-------------------update changed TEXT-------------------------//
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
        // console.log(newEl.firstChild.nodeValue.trim());
      }

      //-----------------update changed ATTRIBUTES----------------------//
      // so till now we have updated the text but not data attributes
      // so whenever elements changes we also need to change attributes

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
        // console.log(Array.from(newEl.attributes));
      }

      // It will return object of all the attributes that have changed
      // and by converting it into array we can loop over it and now we can
      // copy all the attributes from one element to other element
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errormessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
