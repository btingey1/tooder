import View from './View';

class HeaderView extends View {
    _parentElement = document.querySelector('.header');

    // HANDLERS -------------------
    // Handler calendar icon click
    addHandlerCalendar(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.calendar-icon')
            if (!btn) return

            handler();
        })
    }

}

export default new HeaderView();