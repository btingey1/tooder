import checkbox from 'url:../../img/icons/checkbox-unfilled.svg';
import squarecheck from 'url:../../img/icons/square-check-solid.svg';

export default class View {
    // For testing
    _logo = document.querySelector('.logo')

    _clear(element) {
        element.innerHTML = '';
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
        <div class="assigned-task${taskState.checked ? " task--finished" : ''}" data-id="${i}" ">
        <button class="assigned-task--btn"><img src="${taskState.checked ? squarecheck : checkbox}"></button>
        <div class="assigned-task--text">
        <p>${taskState.taskText}</p>
        </div>
        </div>
        `
    }
}
