import View from './View';
import { scrollbarVisible } from '../helpers';

class CurrentTaskView extends View {
    #data;
    _parentElement = document.querySelector('.body-top');
    #title = this._parentElement.querySelector('.main-title');

    toggleScrollingClass() {
        if (scrollbarVisible(this._parentElement.closest('.body-content-wrapper'))) this._parentElement.classList.add('scrolling')
        if (!scrollbarVisible(this._parentElement.closest('.body-content-wrapper'))) this._parentElement.classList.remove('scrolling')
    }

    renderCurrentDate(dateString) {
        const markup = `
        <h1 class="main-title-text">${dateString}</h1>
        <h2 class="main-title-text">What are we working on today?</h1>
        `;

        this._clear(this.#title);
        this.#title.insertAdjacentHTML('afterbegin', markup)
    }

    // FOR TESTING  ----------------------------------
    addHandlerRemoveStorage(handler) {
        this._logo.addEventListener('click', handler)
    }

}

export default new CurrentTaskView();
