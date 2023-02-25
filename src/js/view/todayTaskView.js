import View from './View';

import checkbox from 'url:../../img/icons/checkbox-unfilled.svg';
import squarecheck from 'url:../../img/icons/square-check-solid.svg';

class TodayTaskView extends View {
    #data;
    #parentElement = document.querySelector('.main-current-tasks');

    render(taskStates, newMarkup = true) {
        const markup = newMarkup ? this._compileMarkUp(taskStates) : '';

        this._clear(this.#parentElement);

        if (newMarkup) this.#parentElement.insertAdjacentHTML("afterbegin", markup)
    }

    addCheckHandler(handler) {
        this.#parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.assigned-task--btn');
            if (!btn) return

            const { id } = btn.closest('.assigned-task').dataset

            handler(id)
        })
    }

    _compileMarkUp(taskStates) {
        const taskArr = [];
        taskStates.forEach((taskState, i) =>
            taskState.checked ?
                taskArr.push(this._generateMarkUp(taskState, i)) :
                taskArr.unshift(this._generateMarkUp(taskState, i)
                ));
        return taskArr.join('')
    }

    _generateMarkUp(taskState, i) {
        return `    
        <div class="assigned-task ${taskState.checked ? "task--finished" : ''}" data-id="${i}" ">
        <button class="assigned-task--btn"><img src="${taskState.checked ? squarecheck : checkbox}"></button>
        <div class="assigned-task--text">
        <p>${taskState.taskText}</p>
        </div>
        </div>
        `
    }
}

export default new TodayTaskView();
