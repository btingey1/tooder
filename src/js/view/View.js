import checkbox from 'url:../../img/icons/checkbox-unfilled.svg';
import squarecheck from 'url:../../img/icons/square-check-solid.svg';
import deleteIcon from 'url:../../img/icons/x-solid.svg'
import finishDeleteIcon from 'url:../../img/icons/x-solid-finished.svg'

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
        <div class="assigned-task--text ${mainView ? '' : 'no-hover'}">
        <p>${taskState.taskText}</p>
        </div>
        ${mainView ? `
        <button class="task-delete-button task--btn"><img class="delete--btn--img" draggable="false" src="${taskState.checked ? finishDeleteIcon : deleteIcon}"></button>
        ` : ''}
        </div>
        `
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
}
