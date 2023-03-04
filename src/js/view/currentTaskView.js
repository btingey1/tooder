import View from './View';
import { scrollbarVisible } from '../helpers';
import { mark } from 'regenerator-runtime';

import tagIcon from 'url:../../img/icons/tag-solid.svg';
import timeIcon from 'url:../../img/icons/clock-regular.svg';
import locationIcon from 'url:../../img/icons/location-crosshairs-solid.svg';
import fileIcon from 'url:../../img/icons/file-regular.svg';

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
        // this._parentElement.classList.toggle('body-top-expanded'); // Expand Body
        formDesc.forEach(el => el.classList.toggle('hidden')); // Reveal descriptions
        mainTexts.forEach(el => { if (!el.classList.contains('main-desc-attr')) el.classList.toggle('hidden') }); // Reveal form inputs
        mainTexts.forEach(el => el.classList.toggle('main-text-expanded')); // Apply form input styling
        // mainCurrent.classList.toggle('main-current-expanded'); //Expand form container
        mainTask.classList.toggle('main-task-expanded'); // Expand form div
        mainTaskForm.classList.toggle('main-task-form-expanded'); // Turn form into flex
        mainTexts.forEach(el => { if (el.classList.contains('main-desc-attr')) el.focus() });

        // Reset values when form close
        if (!contentWrapper.classList.contains('no-scroll')) {
            mainTexts.forEach(el => { if (!el.classList.contains('main-desc-attr')) el.value = '' });
        }

    }

    renderDetailAdders(activeFormsObj) {
        const toggleBtn = this._parentElement.querySelector('.main-form-add--btn');
        const detailContainer = this._parentElement.querySelector('.add-option-container');

        toggleBtn.classList.toggle('main-form-add--btn-clicked');

        // Need to recieve list of currently active form types and only render icons for currently inactive ones
        const markup = `
        ${!activeFormsObj.tag ? `<img draggable="false" class="add-opt-tag add-opt-item" data-id="tag" src="${tagIcon}">` : ''}
        ${!activeFormsObj.time ? `<img draggable="false" class="add-opt-time add-opt-item" data-id="time" src="${timeIcon}">` : ''}
        ${!activeFormsObj.location ? `<img draggable="false" class="add-opt-location add-opt-item" data-id="location" src="${locationIcon}">` : ''}
        ${!activeFormsObj.file ? `<img draggable="false" class="add-opt-file add-opt-item" data-id="file" src="${fileIcon}">` : ''}
        `
        this._clear(detailContainer)
        detailContainer.insertAdjacentHTML('afterbegin', markup)
        detailContainer.classList.toggle('close-add-opt');

    }

    renderDetailForm(formType) {

    }

    addDetailExpandHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.main-task-detail--btn');
            if (!btn) return

            handler();
        })
    }

    addAddDetailExpanderHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.main-form-add-attr-btn-div')
            if (!btn) return

            handler()
        })
    }

    addAddDetailHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.add-opt-item')

            if (!btn) return

            const dataId = btn.dataset.id

            handler(dataId)
        })
    }

    checkExpanded() {
        return this._parentElement.querySelector('.main-task-expanded');
    }

    checkAddDetailExpanded() {
        return this._parentElement.querySelector('.main-form-add--btn-clicked');
    }

}

export default new CurrentTaskView();
