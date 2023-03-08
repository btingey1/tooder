import { mark } from 'regenerator-runtime';
import View from './View';

class SubTaskViews extends View {
    #data;
    _parentElement = document.querySelectorAll('.body-sub')
    #prevBody = this._parentElement[0];
    #nextBody = this._parentElement[1];

    // Render previous and next
    render(data) {
        // Take in state data to use in render
        this.#data = data;

        // Select our sub-body content
        const prevContainer = this.#prevBody.querySelector('.sub-content-left');
        const nextContainer = this.#nextBody.querySelector('.sub-content-right');

        // Generate Markup

        const prevMarkup = this._generateMarkup(this.#data.selectedOpt.prevDate);
        const nextMarkup = this._generateMarkup(this.#data.selectedOpt.nextDate);

        // Clear previous render
        this._clear(prevContainer);
        this._clear(nextContainer);

        // Render Everything
        prevContainer.insertAdjacentHTML('afterbegin', prevMarkup);
        nextContainer.insertAdjacentHTML('afterbegin', nextMarkup);
        this._renderDateTitles();
    }

    _renderDateTitles() {
        // Select our subtitles
        const prevSubtitle = this.#prevBody.querySelector('.sub-title-text');
        const nextSubtitle = this.#nextBody.querySelector('.sub-title-text');

        // Clear and replace with title 
        this._clear(prevSubtitle)
        this._clear(nextSubtitle)
        prevSubtitle.insertAdjacentHTML('afterbegin', this._checkRelativeDate(this.#data.selectedOpt.prevDateStr, this.#data.selectedOpt.prevDate));
        nextSubtitle.insertAdjacentHTML('afterbegin', this._checkRelativeDate(this.#data.selectedOpt.nextDateStr, this.#data.selectedOpt.nextDate))
    }

    _checkRelativeDate(inputStr, inputDate) {
        if (inputDate == this.#data.todayDate) {
            return 'Today';
        } else if (inputDate == this.#data.todayOpt.tomorrow) {
            return 'Tomorrow';
        } else if (inputDate == this.#data.todayOpt.yesterday) {
            return 'Yesterday';
        } else return inputStr;
    }

    // Add Handlers

    addSubTaskHandler(handler) {
        this._parentElement.forEach(element => {
            element.addEventListener('click', function (e) {
                const contentPrev = e.target.closest('.sub-content-left');
                const contentNext = e.target.closest('.sub-content-right');

                if (!contentPrev && !contentNext) return

                if (contentPrev) {
                    handler(contentPrev)
                } else handler(contentNext)
            })
        })
    }

    // Generate Markup

    _generateMarkup(dateID) {
        const dateTasks = this.#data.date[dateID];
        const markup = dateTasks ? `<div class="sub-content-container">${this._compileMarkUp(dateTasks, false)}</div>` : this._generateEmptyMarkup();
        return markup;
    }

    _generateEmptyMarkup() {
        return `
        <div class="no-render">
            <span>
                ...
            </span>
        </div>`
    }

}


export default new SubTaskViews();
