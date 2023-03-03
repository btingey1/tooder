import View from './View';

import checkbox from 'url:../../img/icons/checkbox-unfilled.svg';
import squarecheck from 'url:../../img/icons/square-check-solid.svg';

class TodayTaskView extends View {
    #data;
    _parentElement = document.querySelector('.main-current-tasks');

    render(taskStates, newMarkup = true) {
        this._clear(this._parentElement);

        const markup = newMarkup ? this._compileMarkUp(taskStates) : '';

        if (newMarkup) this._parentElement.insertAdjacentHTML("afterbegin", markup)
    }

    renderTextEditForm(textEl, text, finished) {
        this._clear(textEl);

        const markup = `
            <form class="edit-task-form ${finished ? `edit-text-finished` : ``}">
                <input class="edit-text" type="text">
            </form>
        `;

        textEl.insertAdjacentHTML("afterbegin", markup);

        const input = textEl.querySelector('.edit-text');
        input.value = text;
        input.focus();

    }

    hideTasks() {
        this.toggleHidden(this._parentElement)
    }

    addCheckHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.task--btn--img');
            if (!btn) return

            const { id } = btn.closest('.assigned-task').dataset;

            handler(id)
        })
    }

    addDeleteHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.task-del--btn');

            if (!btn) return

            const { id } = btn.closest('.assigned-task').dataset;

            handler(id);
        })
    }

    addEditTextHandler(handler) {
        this._parentElement.addEventListener('dblclick', function (e) {
            const textEl = e.target.closest('.assigned-task--text');

            if (!textEl) return
            if (e.target.closest('.edit-task-form')) return

            const { id } = textEl.closest('.assigned-task').dataset;

            handler(id, textEl)
        })
    }

    addStopEditHandler(handler) {
        // this._parentElement.addEventListener('keydown', function (e) {
        //     e.preventDefault();

        //     if (!e.key === 'Escape') return

        //     handler()
        // })
    }
}

export default new TodayTaskView();
