import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errormessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  // to prevent error during reloading bookmarks
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // return this._data.map(this._generateMarkupPreview).join('');
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    // we are not rendering it to DOM that's why we return it as false
    // and then it will return a string (see in View.js what happend when
    // render is false it will) and we join that string using joinMethod
  }
}
export default new bookmarksView();

// science we are not duplicating the same code of previewView
// so we essenctially seperated the generatedMarkup vali saari cheeze
//  into it's own child view previewView.js
// then here in bookmarks view we bacically try to render that
// view for each of the bookmarks in 14:43
