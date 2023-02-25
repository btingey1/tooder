import View from './View';
import { scrollbarVisible } from '../helpers';

class CurrentTaskView extends View {
    #data;
    #parentElement = document.querySelector('.body-top');
    #title = this.#parentElement.querySelector('.main-title');

    addHandlerSubmission(handler) {
        this.#parentElement.addEventListener('submit', function (e) {
            e.preventDefault();

            handler(e.target);
        });
    }

    clearSubmissionOptions(taskForm) {
        const taskArr = [...taskForm]
        taskArr.forEach(formItem => {
            formItem.value = '';
            formItem.blur();
        });
    }

    toggleScrollingClass() {
        if (scrollbarVisible(this.#parentElement.closest('.body-content-wrapper'))) this.#parentElement.classList.add('scrolling')
        if (!scrollbarVisible(this.#parentElement.closest('.body-content-wrapper'))) this.#parentElement.classList.remove('scrolling')
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
