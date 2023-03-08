import View from './View';
import { scrollbarVisible } from '../helpers';
import { GEO_API_KEY } from '../config';
import { mark } from 'regenerator-runtime';
import * as L from 'leaflet';

import tagIcon from 'url:../../img/icons/tag-solid.svg';
import timeIcon from 'url:../../img/icons/clock-regular.svg';
import locationIcon from 'url:../../img/icons/location-crosshairs-solid.svg';
import fileIcon from 'url:../../img/icons/file-regular.svg';

class CurrentTaskView extends View {
    #data;
    _parentElement = document.querySelector('.body-top');
    _curMarker;
    _map;
    _currentPos;
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
    };

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

    };

    renderDetailAdders(activeFormsObj) {
        const toggleBtn = this._parentElement.querySelector('.main-form-add--btn');
        const detailContainer = this._parentElement.querySelector('.add-option-container');

        if (!activeFormsObj.tag || !activeFormsObj.time || !activeFormsObj.location || !activeFormsObj.file) toggleBtn.classList.toggle('main-form-add--btn-clicked');

        // Need to recieve list of currently active form types and only render icons for currently inactive ones
        const markup = `
        ${!activeFormsObj.tag ? `<img draggable="false" class="add-opt-tag add-opt-item" data-id="tag" src="${tagIcon}">` : ''}
        ${!activeFormsObj.time ? `<img draggable="false" class="add-opt-time add-opt-item" data-id="time" src="${timeIcon}">` : ''}
        ${!activeFormsObj.location ? `<img draggable="false" class="add-opt-location add-opt-item" data-id="location" src="${locationIcon}">` : ''}
        ${!activeFormsObj.file ? `<img draggable="false" class="add-opt-file add-opt-item" data-id="file" src="${fileIcon}">` : ''}
        `
        this._clear(detailContainer)
        detailContainer.insertAdjacentHTML('afterbegin', markup)
        if (!activeFormsObj.tag || !activeFormsObj.time || !activeFormsObj.location || !activeFormsObj.file) detailContainer.classList.toggle('close-add-opt');

    };

    renderDetailForm(formType) {
        const form = this._parentElement.querySelector(`[data-id=${formType}]`);

        form.classList.toggle('hidden');
    };

    renderUploaded() {
        const uploadBtn = this._parentElement.querySelector('.custom-file-upload');

        uploadBtn.classList.add('file-uploaded');
    }

    clearAllOptForms() {
        const forms = this._parentElement.querySelectorAll('.option');

        forms.forEach(form => {
            form.classList.add('hidden');
            form.value = '';
            form.classList.remove('file-uploaded');
        });

        this.clearMap();
    }

    initMap(currentPos, popupHandler) {
        const view = this;
        this._currentPos = currentPos

        const mapOptions = {
            attributionControl: false,
            closePopupOnClick: false,
            zoomControl: false,
        };

        this._map = L.map('map', mapOptions).setView([currentPos.latitude, currentPos.longitude], 14);

        L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this._map);

        this._map.on('click', function (e) {
            if (view._curMarker) view.clearMarker()
            const latlng = e.latlng;
            const marker = L.marker([latlng.lat, latlng.lng]).addTo(view._map);
            view._curMarker = marker;
            popupHandler(marker);
        });
    };

    createMarkerPopup(city) {
        const options = {
            closeButton: false,
            closeOnEscapeKey: false,
            autoClose: false,
        }

        this._curMarker.bindPopup(city, options).openPopup();
    };

    clearMap() {
        if (this._curMarker) {
            this._curMarker.remove();
            this._curMarker = '';
        };
        if (this._map) this._map.setView([this._currentPos.latitude, this._currentPos.longitude], 14);
    };

    clearMarker() {
        this._curMarker.remove();
    };

    addDetailExpandHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.main-task-detail--btn');
            if (!btn) return

            handler();
        })
    };

    addAddDetailExpanderHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.main-form-add-attr-btn-div')
            if (!btn) return

            handler()
        })
    };

    addAddDetailHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.add-opt-item')

            if (!btn) return

            const dataId = btn.dataset.id

            handler(dataId)
        })
    };

    addUploadHandler(handler) {
        this._parentElement.addEventListener('change', function (e) {
            const upload = e.target.closest('.main-file-attr')

            if (!upload) return;

            handler();
        })
    }

    getCurMarker() {
        return this._curMarker;
    };

    getTaskForm() {
        return this._parentElement.querySelector('.main-task-form');
    };

    checkMap() {
        return this._map;
    };

    checkExpanded() {
        return this._parentElement.querySelector('.main-task-expanded');
    };

    checkAddDetailExpanded() {
        return this._parentElement.querySelector('.main-form-add--btn-clicked');
    };


}

export default new CurrentTaskView();
