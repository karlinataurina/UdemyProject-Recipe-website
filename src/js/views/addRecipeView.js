import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _msg = 'Recipe was added successfully!';

    _window = document.querySelector('.add-recipe-window');//window where the form for adding a recipe is
    _overlay = document.querySelector('.overlay');//the blurring effect under the opened form window
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowModal(); // calling the function for opening the modal
        this._addHandlerHideModal(); // calling the function for closing the modal
    };

    // this method is for toggling the modal window:
    toggleWindow() {
        this._overlay.classList.toggle('hidden');// removes 'hidden' class on the click of a button
        this._window.classList.toggle('hidden');// removes 'hidden' class on the click of a button
    }

    // this now is only gonna be used inside of this class, so we add underscore to protect it:
    _addHandlerShowModal() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideModal() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            const dataArr = [...new FormData(this)]; // this is the data array
            const dataObj = Object.fromEntries(dataArr);// this converts array to object
            handler(dataObj);
        })
    }

    _generateMarkup() {}
}

export default new AddRecipeView();