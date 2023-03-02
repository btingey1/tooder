import { parseDateToObj } from '../helpers';
import View from './View';

class CalendarView extends View {
    _parentElement = document.querySelector('.calendar-wrapper');
    _calHeader = document.querySelector('.calendar-header');
    _calTitle = this._parentElement.querySelector('.calendar-header-title');
    _calContent = this._parentElement.querySelector('.calendar-body-content');
    _calNavDivs = this._parentElement.querySelectorAll('.calendar-nav-div')
    #data;

    // Clear current calendar and Render dates and month/year title
    renderCal(data, toggleHidden = true) {
        this.#data = data;

        // Get Markup, clear existing content, render new HTML
        const markup = this._compileCalMarkup();
        this._clear(this._calContent);
        this._calContent.insertAdjacentHTML('afterbegin', markup);
        this._clear(this._calTitle);
        this._calTitle.insertAdjacentHTML('afterbegin', `<h1 class="main-title-text">${this.#data.calendarDates.curMonthStr}</h1>`)

        if (toggleHidden) this.toggleHidden()
    }
    // Compile Markup

    _compileCalMarkup() {
        let markupContainer = ``;
        markupContainer += (this.#data.calendarDates.prevMonth.map(date => this._generateCalMarkup(date, true)).join(''));
        markupContainer += (this.#data.calendarDates.curMonth.map(date => this._generateCalMarkup(date, false)).join(''));
        markupContainer += (this.#data.calendarDates.nextMonth.map(date => this._generateCalMarkup(date, true)).join(''));

        return markupContainer;
    }

    // Generate Markup

    _generateCalMarkup(parsedDate, altMonth) {
        return `
        <div class="grid-item ${parsedDate == this.#data.todayDate ? "cal-today" : ""} ${parsedDate == this.#data.selectedDate ? "cal-selected" : ""}" data-id="${parsedDate}">
            ${altMonth ? `<div class="cal-cover"></div>` : ""}
            <div class="cal-content-number">${parseDateToObj(parsedDate).getDate()}</div>
            <div class="cal-content-tasks">
                ${this.#data.date[parsedDate] ?
                `<div class="cal-task cal-task-finished">${this.#data.taskTotals[parsedDate].finished}</div>
                <div class="cal-task cal-task-assigned">${this.#data.taskTotals[parsedDate].assigned}</div>`
                : ''}
            </div>
        </div>
        `
    }

    // HANDLERS -------------------
    // Handler to change month
    addHandlerNav(handler) {
        this._calNavDivs.forEach(element => element.addEventListener('click', function (e) {
            const next = e.target.classList.contains('calendar-next');
            handler(next)
        }))
    }

    // Handler to choose date
    addHandlerSelectDate(handler) {
        this._calContent.addEventListener('click', function (e) {
            const dateBox = e.target.closest('.grid-item')
            handler(Number(dateBox.dataset.id));
        })
    }

    // Handler to close calendar
    addHandlerClose(handler) {
        this._calHeader.addEventListener('click', function (e) {
            const btn = e.target.closest('.cal-exit-img--btn');
            if (!btn) return

            handler();
        })
    }

}

export default new CalendarView();
