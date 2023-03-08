import checkbox from 'url:../../img/icons/checkbox-unfilled.svg';
import squarecheck from 'url:../../img/icons/square-check-solid.svg';
import deleteIcon from 'url:../../img/icons/x-solid.svg';
import finishDeleteIcon from 'url:../../img/icons/x-solid-finished.svg';
import fileIcon from 'url:../../img/icons/file-regular-small.svg';
import finishFileIcon from 'url:../../img/icons/file-regular-small-finish.svg';
import mapIcon from 'url:../../img/icons/location-crosshairs-small.svg';
import finishMapIcon from 'url:../../img/icons/location-crosshairs-small-finish.svg';


import { convertMilitaryToStandard } from '../helpers';

export default class View {
    _parentElement;

    // For testing
    _logo = document.querySelector('.logo')

    toggleHidden() {
        this._parentElement.classList.toggle('hidden')
    }

    _clear(element) {
        element.innerHTML = '';
    }

    clearSubmissionOptions(taskForm) {
        const taskArr = [...taskForm];
        taskArr.forEach(formItem => {
            formItem.value = '';
            formItem.blur();
        });
    }

    _compileMarkUp(taskStates, mainView = true) {
        const taskArr = [];
        taskStates.forEach((taskState, i) =>
            taskState.checked ?
                taskArr.push(this._generateMarkUp(taskState, i, mainView)) :
                taskArr.unshift(this._generateMarkUp(taskState, i, mainView)
                ));
        return taskArr.join('')
    }

    _generateMarkUp(taskState, i, mainView = true) {
        return `    
        <div class="assigned-task${taskState.checked ? " task--finished" : ''}" data-id="${i}" data-ed="${taskState.id}">
        <button class="assigned-task--btn task--btn"><img class="task--btn--img task---btn" draggable="false" src="${taskState.checked ? squarecheck : checkbox}"></button>
        <div class="center-view">
        <div class="time-view">${taskState.taskTime ? convertMilitaryToStandard(taskState.taskTime) : ''}</div>
        <div class="assigned-task--text ${mainView ? '' : 'no-hover'}">
        <p class="direct-text">${taskState.taskText}</p>
        </div>
        <div class="tag-view-container">
        ${taskState.taskTag ? this._renderTaskTags(taskState.taskTag) : ''}
        </div>
        </div>
        ${mainView ? `
        <div class='end-buttons'>
        ${taskState.taskFile ? `<a class="file-download-button" href="${taskState.taskFile}" target="_blank"><img draggable="false" src="${taskState.checked ? finishFileIcon : fileIcon}"></a>` : ''}
        ${taskState.taskCoords ? `<a title="${taskState.taskLocation ? taskState.taskLocation : ''}" class="location-visit-button" href="${'https://www.google.com/maps/place/' + taskState.taskCoords}" target="_blank"><img draggable="false" src="${taskState.checked ? finishMapIcon : mapIcon}"></a>` : ''}
        <button class="task-delete-button task--btn"><img class="delete--btn--img" draggable="false" src="${taskState.checked ? finishDeleteIcon : deleteIcon}"></button>
        </div>
        ` : ''}
        </div>
        `
    }

    _renderTaskTags(tagArr) {
        const markupArr = tagArr.map(tag => `<div class="tag-view" data-tag="${tag}">${tag}</div>`);
        return markupArr.join('')
    }

    // Should probably refactor later, need to exclude all todayView buttons
    addHandlerSubmission(handler, needID = false, focusOut = false) {
        ['submit', (focusOut ? 'focusout' : '')].forEach(event => this._parentElement.addEventListener(event, function (e) {
            e.preventDefault();

            // Exit if inncorrect target
            if (e.target.closest('.assigned-task--btn')) return
            if (e.target.closest('.task-del--btn')) return

            let id;
            let ed;
            if (needID) {
                id = Number(e.target.closest('.assigned-task').dataset.id);
                ed = Number(e.target.closest('.assigned-task').dataset.ed);
            }


            if (event == 'focusout') {
                return handler(e.target.closest('.edit-task-form'), id, ed)
            }

            handler(e.target, id, ed);
        }));
    }

    getViewImages() {
        return [checkbox, squarecheck, deleteIcon, finishDeleteIcon, fileIcon, finishFileIcon, mapIcon, finishMapIcon]
    }

    preLoadImg(srcArr) {
        srcArr.forEach(src => {
            let img = new Image();
            img.src = src;
        })
    }
}
