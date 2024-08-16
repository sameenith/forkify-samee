import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errormessage = 'No recipe found for your query! Please try again :)';
  _message = '';

  //--------------------New way of rendring markup----------------------//
  // using previewView.js as child view
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();

/*
//////////////////////////////////////////////////////////////////////////
//------------------old way (without use of child view)-----------------//
_generateMarkup() {
  return this._data.map(this._generateMarkupPreview).join('');
}

_generateMarkupPreview(results) {
  const id = window.location.hash.slice(1);
  return `<li class="preview">
  <a class="preview__link ${
    results.id === id ? 'preview__link--active' : ''
  } " href="#${results.id}">
  <figure class="preview__fig">
  <img src="${results.image}" alt="Test" />
  </figure>
  <div class="preview__data">
  <h4 class="preview__title">${results.title}</h4>
  <p class="preview__publisher">${results.publisher}</p>          
  </div>
  </a>
  </li>;`;
}
/////////////////////////////////////////////////////////////////////////
*/
