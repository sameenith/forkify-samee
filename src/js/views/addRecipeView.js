import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe is succsessfully added :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  /*
  we want to call this funtion addHandlerShowWindow() as soon as the page 
  loads, in this case it has nothing to do with controller,nothing 
  special is happning here that controller need to tell us,so when the 
  click happens on btnOpen all need to happen is really window to show 
  "so therefore we can this funtion here as soon as the object is created"
  and to do this we use a constructor funtion
  */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    /*
    function () {
      // here this key word will point to _btnOpen or the element on which
      // listener is atteched to that is _btnOpen in this case
      //  so we created toggleWindow method
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
      
    }
    */
  }

  // removing form on clicking on btn or anywhere in overlay
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  /*
  now do we get excess to these values, we could go and select all these 
  form elements one by one and then read the value property or we can use 
  easier way by using something called 
  "FormData( pass an element that is a form -- in our case that is parentElement)" 
   it is a modern API and then spread that object into an array
 */
  // what we want to do with this data? is to upload this data to API
  // and that will happen in model
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      // converting array to object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

// we have to do in controller is to import this object, otherwise our
// controller never execute this file
export default new AddRecipeView();
