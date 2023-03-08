import View from './View';

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

    noScrollTasks(toggle = true) {
        // this.toggleHidden(this._parentElement);
        const container = this._parentElement.closest('.body-content-wrapper');
        const sibling = container.querySelector('.body-top');



        if (toggle) {
            this._parentElement.classList.toggle('no-scroll')
        } else this._parentElement.classList.add('no-scroll');
        if (this._parentElement.classList.contains('no-scroll')) this._parentElement.style.height = (container.clientHeight - sibling.clientHeight)
        else this._parentElement.style.height = '';
    }

    addCheckHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.task--btn--img');
            const container = e.target.closest('.main-current-tasks');

            if (!btn) return
            if (container.classList.contains('no-scroll')) return

            const { id } = btn.closest('.assigned-task').dataset;

            handler(id)
        })
    }

    addDeleteHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.task-delete-button');
            const container = e.target.closest('.main-current-tasks');

            if (!btn) return
            if (container.classList.contains('no-scroll')) return

            const { id } = btn.closest('.assigned-task').dataset;

            handler(id);
        })
    }

    addEditTextHandler(handler) {
        this._parentElement.addEventListener('dblclick', function (e) {
            const textEl = e.target.closest('.assigned-task--text');
            const container = e.target.closest('.main-current-tasks');

            if (!textEl) return
            if (e.target.closest('.edit-task-form')) return
            if (container.classList.contains('no-scroll')) return

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

    fixLargeTextDivs() {
        const tasks = this._parentElement.querySelectorAll('.assigned-task');

        tasks.forEach(task => {
            const text = task.querySelector('.direct-text');
            const { lineHeight } = getComputedStyle(text);
            const lineHeightParsed = parseInt(lineHeight.split('px')[0]);
            const amountOfLinesTilAdjust = 2;

            if (text.offsetHeight >= (lineHeightParsed * amountOfLinesTilAdjust)) task.classList.add('wrapped-text')
        })
    }
}

export default new TodayTaskView();
