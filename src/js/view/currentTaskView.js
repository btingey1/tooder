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

    renderExpandedTaskView() {
        const icon = this._parentElement.querySelector('.main-task-detail--img');
        const mainTaskBtn = this._parentElement.querySelector('.main-task-detail--btn');
        const mainCurrent = this._parentElement.querySelector('.main-current');
        const mainTask = this._parentElement.querySelector('.main-task');
        const mainTaskForm = this._parentElement.querySelector('.main-task-form');
        const mainTexts = this._parentElement.querySelectorAll('.main-text');
        const formDesc = this._parentElement.querySelectorAll('.form-desc');
        const contentWrapper = this._parentElement.closest('.body-content-wrapper');

        contentWrapper.classList.toggle('no-scroll')
        icon.classList.toggle('main-task-detail--clicked');
        mainTaskBtn.classList.toggle('main-task-detail--btn-expanded'); // Color
        this._parentElement.classList.toggle('body-top-expanded'); // Expand Body
        formDesc.forEach(el => el.classList.toggle('hidden')); // Reveal descriptions
        mainTexts.forEach(el => { if (!el.classList.contains('main-desc-attr')) el.classList.toggle('hidden') }); // Reveal form inputs
        mainTexts.forEach(el => el.classList.toggle('main-text-expanded')); // Apply form input styling
        mainCurrent.classList.toggle('main-current-expanded'); //Expand form container
        mainTask.classList.toggle('main-task-expanded'); // Expand form div
        mainTaskForm.classList.toggle('main-task-form-expanded'); // Turn form into flex
        mainTexts.forEach(el => { if (el.classList.contains('main-desc-attr')) el.focus() });

        // Reset values when form close
        if (!contentWrapper.classList.contains('no-scroll')) {
            mainTexts.forEach(el => { if (!el.classList.contains('main-desc-attr')) el.value = '' });
        }

    }

    addDetailExpandHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.main-task-detail--btn');
            if (!btn) return

            handler();
        })
    }

    checkExpanded() {
        return this._parentElement.querySelector('.main-current-expanded');
    }

}

export default new CurrentTaskView();
